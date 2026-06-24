const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

let pool = null;
let useMySQL = false;

// Paths for JSON fallback files
const DATA_DIR = path.join(__dirname, '../data');
const FILES = {
  products: path.join(DATA_DIR, 'products.json'),
  users: path.join(DATA_DIR, 'users.json'),
  cart: path.join(DATA_DIR, 'cart.json'),
  orders: path.join(DATA_DIR, 'orders.json')
};

// Ensure JSON directory and files exist
function initJSONDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Initialize products if empty
  if (!fs.existsSync(FILES.products)) {
    const seedProducts = require('../models/products.json');
    fs.writeFileSync(FILES.products, JSON.stringify(seedProducts, null, 2));
  }

  // Initialize others
  ['users', 'cart', 'orders'].forEach(key => {
    if (!fs.existsSync(FILES[key])) {
      fs.writeFileSync(FILES[key], JSON.stringify([], null, 2));
    }
  });

  console.log('✔ JSON Database Fallback Initialized in backend/data folder.');
}

// Read a JSON file
function readJSON(fileKey) {
  try {
    const data = fs.readFileSync(FILES[fileKey], 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${fileKey} file:`, err);
    return [];
  }
}

// Write to a JSON file
function writeJSON(fileKey, data) {
  try {
    fs.writeFileSync(FILES[fileKey], JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${fileKey} file:`, err);
  }
}

// Initialize database connection
async function connectDB() {
  // Load environment variables
  require('dotenv').config();

  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'gaba_db',
    port: process.env.DB_PORT || 3306
  };

  try {
    console.log(`Connecting to MySQL at ${config.host}:${config.port}...`);
    // Create temporary connection to test
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.user,
      password: config.password,
      port: config.port
    });
    
    // Ensure DB exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\``);
    await connection.end();

    // Setup pool
    pool = mysql.createPool({
      ...config,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Test connection
    const testConn = await pool.getConnection();
    console.log('✔ Successfully connected to MySQL database.');
    testConn.release();
    useMySQL = true;
  } catch (error) {
    console.warn('⚠ MySQL connection failed:', error.message);
    console.warn('⚠ Falling back to Local JSON File Database.');
    initJSONDatabase();
    useMySQL = false;
  }
}

// DATABASE INTERFACE WRAPPERS

const db = {
  connectDB,
  isMySQL: () => useMySQL,
  getPool: () => pool,

  // --- Users Service ---
  users: {
    async findByEmail(email) {
      if (useMySQL) {
        const [rows] = await pool.query('SELECT * FROM Users WHERE Email = ?', [email]);
        return rows[0];
      } else {
        const list = readJSON('users');
        return list.find(u => u.Email.toLowerCase() === email.toLowerCase());
      }
    },

    async findById(id) {
      if (useMySQL) {
        const [rows] = await pool.query('SELECT * FROM Users WHERE User_ID = ?', [id]);
        return rows[0];
      } else {
        const list = readJSON('users');
        return list.find(u => u.User_ID === parseInt(id));
      }
    },

    async create(name, email, hashedPassword, role = 'user') {
      if (useMySQL) {
        const [result] = await pool.query(
          'INSERT INTO Users (Name, Email, Password, Role) VALUES (?, ?, ?, ?)',
          [name, email, hashedPassword, role]
        );
        return { User_ID: result.insertId, Name: name, Email: email, Role: role };
      } else {
        const list = readJSON('users');
        const newUser = {
          User_ID: Date.now(),
          Name: name,
          Email: email,
          Password: hashedPassword,
          Role: role,
          Created_At: new Date().toISOString()
        };
        list.push(newUser);
        writeJSON('users', list);
        // Exclude password in return
        const { Password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
      }
    }
  },

  // --- Products Service ---
  products: {
    async getAll(filters = {}) {
      if (useMySQL) {
        let query = 'SELECT * FROM Products WHERE 1=1';
        const params = [];

        if (filters.category) {
          query += ' AND Category = ?';
          params.push(filters.category);
        }
        if (filters.fabric) {
          query += ' AND Fabric_Quality LIKE ?';
          params.push(`%${filters.fabric}%`);
        }
        if (filters.priceMin) {
          query += ' AND Price >= ?';
          params.push(parseFloat(filters.priceMin));
        }
        if (filters.priceMax) {
          query += ' AND Price <= ?';
          params.push(parseFloat(filters.priceMax));
        }
        if (filters.search) {
          query += ' AND (Product_Name LIKE ? OR Description LIKE ?)';
          params.push(`%${filters.search}%`, `%${filters.search}%`);
        }

        const [rows] = await pool.query(query, params);
        // Convert comma-separated string back to array
        return rows.map(r => ({
          ...r,
          Size_Available: typeof r.Size_Available === 'string' ? r.Size_Available.split(',') : r.Size_Available
        }));
      } else {
        let list = readJSON('products');
        if (filters.category) {
          list = list.filter(p => p.Category.toLowerCase() === filters.category.toLowerCase());
        }
        if (filters.fabric) {
          list = list.filter(p => p.Fabric_Quality.toLowerCase().includes(filters.fabric.toLowerCase()));
        }
        if (filters.priceMin) {
          list = list.filter(p => p.Price >= parseFloat(filters.priceMin));
        }
        if (filters.priceMax) {
          list = list.filter(p => p.Price <= parseFloat(filters.priceMax));
        }
        if (filters.search) {
          const s = filters.search.toLowerCase();
          list = list.filter(p => p.Product_Name.toLowerCase().includes(s) || p.Description.toLowerCase().includes(s));
        }
        if (filters.size) {
          list = list.filter(p => p.Size_Available.includes(filters.size));
        }
        return list;
      }
    },

    async getById(id) {
      if (useMySQL) {
        const [rows] = await pool.query('SELECT * FROM Products WHERE Product_ID = ?', [id]);
        if (!rows[0]) return null;
        return {
          ...rows[0],
          Size_Available: typeof rows[0].Size_Available === 'string' ? rows[0].Size_Available.split(',') : rows[0].Size_Available
        };
      } else {
        const list = readJSON('products');
        return list.find(p => p.Product_ID === id) || null;
      }
    },

    async create(product) {
      const sizesStr = Array.isArray(product.Size_Available) ? product.Size_Available.join(',') : product.Size_Available;
      if (useMySQL) {
        await pool.query(
          'INSERT INTO Products (Product_ID, Product_Name, Category, Fabric_Quality, Price, Size_Available, Stock_Quantity, Description, Image_URL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            product.Product_ID,
            product.Product_Name,
            product.Category,
            product.Fabric_Quality,
            product.Price,
            sizesStr,
            product.Stock_Quantity,
            product.Description,
            product.Image_URL
          ]
        );
        return product;
      } else {
        const list = readJSON('products');
        const newProduct = {
          ...product,
          Price: parseFloat(product.Price),
          Stock_Quantity: parseInt(product.Stock_Quantity),
          Size_Available: Array.isArray(product.Size_Available) ? product.Size_Available : sizesStr.split(','),
          Created_At: new Date().toISOString()
        };
        list.push(newProduct);
        writeJSON('products', list);
        return newProduct;
      }
    },

    async update(id, product) {
      const sizesStr = Array.isArray(product.Size_Available) ? product.Size_Available.join(',') : product.Size_Available;
      if (useMySQL) {
        await pool.query(
          'UPDATE Products SET Product_Name = ?, Category = ?, Fabric_Quality = ?, Price = ?, Size_Available = ?, Stock_Quantity = ?, Description = ?, Image_URL = ? WHERE Product_ID = ?',
          [
            product.Product_Name,
            product.Category,
            product.Fabric_Quality,
            product.Price,
            sizesStr,
            product.Stock_Quantity,
            product.Description,
            product.Image_URL,
            id
          ]
        );
        return { ...product, Product_ID: id };
      } else {
        let list = readJSON('products');
        const idx = list.findIndex(p => p.Product_ID === id);
        if (idx === -1) return null;
        const updated = {
          ...list[idx],
          Product_Name: product.Product_Name,
          Category: product.Category,
          Fabric_Quality: product.Fabric_Quality,
          Price: parseFloat(product.Price),
          Size_Available: Array.isArray(product.Size_Available) ? product.Size_Available : sizesStr.split(','),
          Stock_Quantity: parseInt(product.Stock_Quantity),
          Description: product.Description,
          Image_URL: product.Image_URL
        };
        list[idx] = updated;
        writeJSON('products', list);
        return updated;
      }
    },

    async delete(id) {
      if (useMySQL) {
        const [result] = await pool.query('DELETE FROM Products WHERE Product_ID = ?', [id]);
        return result.affectedRows > 0;
      } else {
        let list = readJSON('products');
        const originalLength = list.length;
        list = list.filter(p => p.Product_ID !== id);
        writeJSON('products', list);
        return list.length < originalLength;
      }
    }
  },

  // --- Cart Service ---
  cart: {
    async getByUser(userId) {
      if (useMySQL) {
        const query = `
          SELECT c.*, p.Product_Name, p.Price, p.Image_URL, p.Fabric_Quality, p.Brand_Name 
          FROM Cart c 
          JOIN Products p ON c.Product_ID = p.Product_ID 
          WHERE c.User_ID = ?
        `;
        const [rows] = await pool.query(query, [userId]);
        return rows;
      } else {
        const cartList = readJSON('cart');
        const productList = readJSON('products');
        const userCart = cartList.filter(c => c.User_ID === parseInt(userId));
        return userCart.map(item => {
          const product = productList.find(p => p.Product_ID === item.Product_ID) || {};
          return {
            ...item,
            Product_Name: product.Product_Name || 'Unknown Product',
            Price: product.Price || 0,
            Image_URL: product.Image_URL || '',
            Fabric_Quality: product.Fabric_Quality || '',
            Brand_Name: product.Brand_Name || 'GABA'
          };
        });
      }
    },

    async add(userId, productId, size, quantity) {
      if (useMySQL) {
        // Check if item already exists
        const [existing] = await pool.query(
          'SELECT * FROM Cart WHERE User_ID = ? AND Product_ID = ? AND Size = ?',
          [userId, productId, size]
        );
        if (existing.length > 0) {
          const newQty = existing[0].Quantity + quantity;
          await pool.query('UPDATE Cart SET Quantity = ? WHERE Cart_ID = ?', [newQty, existing[0].Cart_ID]);
          return { Cart_ID: existing[0].Cart_ID, User_ID: userId, Product_ID: productId, Size: size, Quantity: newQty };
        } else {
          const [result] = await pool.query(
            'INSERT INTO Cart (User_ID, Product_ID, Size, Quantity) VALUES (?, ?, ?, ?)',
            [userId, productId, size, quantity]
          );
          return { Cart_ID: result.insertId, User_ID: userId, Product_ID: productId, Size: size, Quantity: quantity };
        }
      } else {
        const list = readJSON('cart');
        const existingIdx = list.findIndex(c => c.User_ID === parseInt(userId) && c.Product_ID === productId && c.Size === size);
        if (existingIdx !== -1) {
          list[existingIdx].Quantity += quantity;
          writeJSON('cart', list);
          return list[existingIdx];
        } else {
          const newItem = {
            Cart_ID: Date.now(),
            User_ID: parseInt(userId),
            Product_ID: productId,
            Size: size,
            Quantity: quantity,
            Created_At: new Date().toISOString()
          };
          list.push(newItem);
          writeJSON('cart', list);
          return newItem;
        }
      }
    },

    async updateQuantity(cartId, quantity) {
      if (useMySQL) {
        await pool.query('UPDATE Cart SET Quantity = ? WHERE Cart_ID = ?', [quantity, cartId]);
        return true;
      } else {
        const list = readJSON('cart');
        const idx = list.findIndex(c => c.Cart_ID === parseInt(cartId));
        if (idx === -1) return false;
        list[idx].Quantity = quantity;
        writeJSON('cart', list);
        return true;
      }
    },

    async remove(cartId) {
      if (useMySQL) {
        const [result] = await pool.query('DELETE FROM Cart WHERE Cart_ID = ?', [cartId]);
        return result.affectedRows > 0;
      } else {
        let list = readJSON('cart');
        const originalLength = list.length;
        list = list.filter(c => c.Cart_ID !== parseInt(cartId));
        writeJSON('cart', list);
        return list.length < originalLength;
      }
    },

    async clear(userId) {
      if (useMySQL) {
        await pool.query('DELETE FROM Cart WHERE User_ID = ?', [userId]);
        return true;
      } else {
        let list = readJSON('cart');
        list = list.filter(c => c.User_ID !== parseInt(userId));
        writeJSON('cart', list);
        return true;
      }
    }
  },

  // --- Orders Service ---
  orders: {
    async create(userId, items, totalAmount) {
      if (useMySQL) {
        const connection = await pool.getConnection();
        try {
          await connection.beginTransaction();

          // 1. Create order
          const [orderResult] = await connection.query(
            'INSERT INTO Orders (User_ID, Total_Amount, Status) VALUES (?, ?, "Pending")',
            [userId, totalAmount]
          );
          const orderId = orderResult.insertId;

          // 2. Insert items and update product stocks
          for (const item of items) {
            await connection.query(
              'INSERT INTO Order_Items (Order_ID, Product_ID, Size, Quantity, Price) VALUES (?, ?, ?, ?, ?)',
              [orderId, item.Product_ID, item.Size, item.Quantity, item.Price]
            );

            // Deduct stock
            await connection.query(
              'UPDATE Products SET Stock_Quantity = GREATEST(0, Stock_Quantity - ?) WHERE Product_ID = ?',
              [item.Quantity, item.Product_ID]
            );
          }

          // 3. Clear cart
          await connection.query('DELETE FROM Cart WHERE User_ID = ?', [userId]);

          await connection.commit();
          return { Order_ID: orderId, User_ID: userId, Total_Amount: totalAmount, Status: 'Pending' };
        } catch (err) {
          await connection.rollback();
          throw err;
        } finally {
          connection.release();
        }
      } else {
        const orderList = readJSON('orders');
        const productList = readJSON('products');
        const orderId = Date.now();

        // 1. Deduct stock and prepare order items
        const orderItems = items.map(item => {
          // Find and deduct stock
          const prodIdx = productList.findIndex(p => p.Product_ID === item.Product_ID);
          if (prodIdx !== -1) {
            productList[prodIdx].Stock_Quantity = Math.max(0, productList[prodIdx].Stock_Quantity - item.Quantity);
          }

          return {
            OrderItem_ID: Date.now() + Math.random(),
            Product_ID: item.Product_ID,
            Product_Name: item.Product_Name,
            Image_URL: item.Image_URL,
            Size: item.Size,
            Quantity: item.Quantity,
            Price: item.Price,
            Return_Exchange_Status: 'None',
            Return_Exchange_Reason: null
          };
        });

        // Save products updated stock
        writeJSON('products', productList);

        // 2. Create the order
        const newOrder = {
          Order_ID: orderId,
          User_ID: parseInt(userId),
          Total_Amount: parseFloat(totalAmount),
          Status: 'Pending',
          Created_At: new Date().toISOString(),
          Items: orderItems
        };

        orderList.push(newOrder);
        writeJSON('orders', orderList);

        // 3. Clear cart
        let cartList = readJSON('cart');
        cartList = cartList.filter(c => c.User_ID !== parseInt(userId));
        writeJSON('cart', cartList);

        return newOrder;
      }
    },

    async getByUser(userId) {
      if (useMySQL) {
        // Fetch orders
        const [orders] = await pool.query(
          'SELECT * FROM Orders WHERE User_ID = ? ORDER BY Created_At DESC',
          [userId]
        );

        // Fetch items for each order
        for (const order of orders) {
          const query = `
            SELECT oi.*, p.Product_Name, p.Image_URL 
            FROM Order_Items oi 
            LEFT JOIN Products p ON oi.Product_ID = p.Product_ID 
            WHERE oi.Order_ID = ?
          `;
          const [items] = await pool.query(query, [order.Order_ID]);
          order.Items = items;
        }
        return orders;
      } else {
        const orderList = readJSON('orders');
        return orderList
          .filter(o => o.User_ID === parseInt(userId))
          .sort((a, b) => new Date(b.Created_At) - new Date(a.Created_At));
      }
    },

    async getAll() {
      if (useMySQL) {
        const [orders] = await pool.query('SELECT o.*, u.Name, u.Email FROM Orders o JOIN Users u ON o.User_ID = u.User_ID ORDER BY o.Created_At DESC');
        for (const order of orders) {
          const query = `
            SELECT oi.*, p.Product_Name, p.Image_URL 
            FROM Order_Items oi 
            LEFT JOIN Products p ON oi.Product_ID = p.Product_ID 
            WHERE oi.Order_ID = ?
          `;
          const [items] = await pool.query(query, [order.Order_ID]);
          order.Items = items;
        }
        return orders;
      } else {
        const orderList = readJSON('orders');
        const userList = readJSON('users');
        return orderList.map(o => {
          const user = userList.find(u => u.User_ID === o.User_ID) || {};
          return {
            ...o,
            Name: user.Name || 'Unknown User',
            Email: user.Email || 'N/A'
          };
        }).sort((a, b) => new Date(b.Created_At) - new Date(a.Created_At));
      }
    },

    async updateStatus(orderId, status) {
      if (useMySQL) {
        await pool.query('UPDATE Orders SET Status = ? WHERE Order_ID = ?', [status, orderId]);
        return true;
      } else {
        const list = readJSON('orders');
        const idx = list.findIndex(o => o.Order_ID === parseInt(orderId));
        if (idx === -1) return false;
        list[idx].Status = status;
        writeJSON('orders', list);
        return true;
      }
    },

    async requestReturnExchange(orderItemId, type, reason) {
      const status = type === 'return' ? 'Return_Requested' : 'Exchange_Requested';
      if (useMySQL) {
        await pool.query(
          'UPDATE Order_Items SET Return_Exchange_Status = ?, Return_Exchange_Reason = ? WHERE OrderItem_ID = ?',
          [status, reason, orderItemId]
        );
        return true;
      } else {
        const list = readJSON('orders');
        let found = false;
        for (const order of list) {
          const item = order.Items.find(i => i.OrderItem_ID === parseFloat(orderItemId) || i.OrderItem_ID === orderItemId);
          if (item) {
            item.Return_Exchange_Status = status;
            item.Return_Exchange_Reason = reason;
            found = true;
            break;
          }
        }
        if (found) {
          writeJSON('orders', list);
          return true;
        }
        return false;
      }
    },

    async reviewReturnExchange(orderItemId, approve) {
      if (useMySQL) {
        // Fetch current status
        const [rows] = await pool.query('SELECT Return_Exchange_Status, Product_ID, Quantity FROM Order_Items WHERE OrderItem_ID = ?', [orderItemId]);
        if (rows.length === 0) return false;
        
        const currentStatus = rows[0].Return_Exchange_Status;
        let newStatus = 'None';
        
        if (currentStatus === 'Return_Requested') {
          newStatus = approve ? 'Return_Approved' : 'Return_Rejected';
        } else if (currentStatus === 'Exchange_Requested') {
          newStatus = approve ? 'Exchange_Approved' : 'Exchange_Rejected';
        }

        await pool.query('UPDATE Order_Items SET Return_Exchange_Status = ? WHERE OrderItem_ID = ?', [newStatus, orderItemId]);

        // If Return approved, restore stock
        if (approve && newStatus === 'Return_Approved' && rows[0].Product_ID) {
          await pool.query('UPDATE Products SET Stock_Quantity = Stock_Quantity + ? WHERE Product_ID = ?', [rows[0].Quantity, rows[0].Product_ID]);
        }

        return true;
      } else {
        const list = readJSON('orders');
        const productList = readJSON('products');
        let found = false;

        for (const order of list) {
          const item = order.Items.find(i => i.OrderItem_ID === parseFloat(orderItemId) || i.OrderItem_ID === orderItemId);
          if (item) {
            const currentStatus = item.Return_Exchange_Status;
            let newStatus = 'None';

            if (currentStatus === 'Return_Requested') {
              newStatus = approve ? 'Return_Approved' : 'Return_Rejected';
            } else if (currentStatus === 'Exchange_Requested') {
              newStatus = approve ? 'Exchange_Approved' : 'Exchange_Rejected';
            }

            item.Return_Exchange_Status = newStatus;
            found = true;

            // Restore stock if return approved
            if (approve && newStatus === 'Return_Approved' && item.Product_ID) {
              const prodIdx = productList.findIndex(p => p.Product_ID === item.Product_ID);
              if (prodIdx !== -1) {
                productList[prodIdx].Stock_Quantity += item.Quantity;
              }
            }
            break;
          }
        }

        if (found) {
          writeJSON('orders', list);
          writeJSON('products', productList);
          return true;
        }
        return false;
      }
    }
  }
};

module.exports = db;
