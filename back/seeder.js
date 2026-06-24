const db = require('./config/db');
const products = require('./models/products.json');

async function seed() {
  console.log('Starting seeder script...');
  
  // Connect to DB
  await db.connectDB();

  if (!db.isMySQL()) {
    console.log('Skipping MySQL seeding: Running in Local JSON Database Fallback mode.');
    console.log('Products have already been copied to backend/data/products.json.');
    process.exit(0);
  }

  const pool = db.getPool();

  try {
    console.log('Cleaning Products table in MySQL...');
    await pool.query('DELETE FROM Products');

    console.log(`Inserting ${products.length} GABA products into MySQL...`);
    for (const prod of products) {
      const sizesStr = Array.isArray(prod.Size_Available) 
        ? prod.Size_Available.join(',') 
        : prod.Size_Available;

      await pool.query(
        'INSERT INTO Products (Product_ID, Brand_Name, Product_Name, Category, Fabric_Quality, Price, Size_Available, Stock_Quantity, Description, Image_URL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          prod.Product_ID,
          prod.Brand_Name || 'GABA',
          prod.Product_Name,
          prod.Category,
          prod.Fabric_Quality,
          prod.Price,
          sizesStr,
          prod.Stock_Quantity,
          prod.Description,
          prod.Image_URL
        ]
      );
    }

    console.log('✔ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
