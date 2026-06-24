import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, LayoutGrid, ClipboardList, RefreshCw, Check, X, ShieldAlert, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard({ onBackToStore }) {
  const { token } = useAuth();
  
  // Dashboard navigation
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' or 'orders'
  
  // Inventory state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // Form fields state
  const [prodId, setProdId] = useState(''); // Only visible/editable when creating new
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Men');
  const [fabric, setFabric] = useState('100% Premium Cotton');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL', 'XXL']); // Checked list
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageSource, setImageSource] = useState('url'); // 'url' or 'upload'
  const [uploading, setUploading] = useState(false);

  // Handle local image file conversion and upload to backend
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Max size is 5MB.');
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const res = await fetch('/api/products/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ base64Data: reader.result })
        });
        
        const data = await res.json();
        if (res.ok) {
          setImageUrl(data.url);
        } else {
          alert(data.message || 'Image upload failed.');
        }
      } catch (err) {
        console.error('Upload request error:', err);
        alert('Server connection error during upload.');
      } finally {
        setUploading(false);
      }
    };
  };

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch all products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch all client orders
  const fetchOrders = async () => {
    if (!token) return;
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [token]);

  // Handle sizes selection checkbox
  const handleSizeCheckbox = (size) => {
    setSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  // Reset form
  const resetForm = () => {
    setProdId('');
    setName('');
    setCategory('Men');
    setFabric('100% Premium Cotton');
    setPrice('');
    setStock('');
    setSizes(['S', 'M', 'L', 'XL', 'XXL']);
    setDescription('');
    setImageUrl('');
    setImageSource('url');
    setUploading(false);
    setIsEditing(false);
    setEditingProductId(null);
  };

  // Create or Update Product handler
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !stock || sizes.length === 0) {
      alert('Please fill in all required fields and select at least one size.');
      return;
    }

    const payload = {
      Product_Name: name,
      Category: category,
      Fabric_Quality: fabric,
      Price: parseFloat(price),
      Size_Available: sizes,
      Stock_Quantity: parseInt(stock),
      Description: description,
      Image_URL: imageUrl || undefined
    };

    let url = '/api/products';
    let method = 'POST';

    if (isEditing) {
      url = `/api/products/${editingProductId}`;
      method = 'PUT';
    } else {
      if (prodId) payload.Product_ID = prodId;
    }

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(isEditing ? 'Product updated successfully!' : 'Product added successfully!');
        resetForm();
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.message || 'Action failed.');
      }
    } catch (err) {
      console.error('Submit product error:', err);
      alert('Error connecting to server.');
    }
  };

  // Load product info into form for editing
  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditingProductId(product.Product_ID);
    setProdId(product.Product_ID);
    setName(product.Product_Name);
    setCategory(product.Category);
    setFabric(product.Fabric_Quality);
    setPrice(product.Price);
    setStock(product.Stock_Quantity);
    setSizes(Array.isArray(product.Size_Available) ? product.Size_Available : [product.Size_Available]);
    setDescription(product.Description);
    setImageUrl(product.Image_URL);
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm(`Are you sure you want to delete product "${id}" from GABA inventory?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        alert('Product deleted successfully.');
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.message || 'Deletion failed.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Update order delivery status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ Status: newStatus })
      });

      if (res.ok) {
        fetchOrders(); // Refresh orders
      } else {
        alert('Failed to update status.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Approve or Reject Return/Exchange requests
  const handleReviewRequest = async (orderItemId, approve) => {
    try {
      const res = await fetch(`/api/orders/items/${orderItemId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ approve })
      });

      if (res.ok) {
        alert(`Request ${approve ? 'Approved' : 'Rejected'} successfully.`);
        fetchOrders(); // Refresh order log
        fetchProducts(); // Refresh stocks in case return was approved
      } else {
        alert('Failed to process review.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 text-xs font-semibold text-slate-300">
      
      {/* Back button */}
      <button 
        onClick={onBackToStore}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white mb-6 group cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Catalog
      </button>

      {/* Admin Title Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2 tracking-wide uppercase">
            <LayoutGrid className="w-5 h-5 text-indigo-400" />
            GABA CONTROL PANEL
          </h2>
          <p className="text-[10px] text-slate-400 font-normal mt-1">
            System Admin panel to manage inventory stock, monitor client invoices, and resolve product return tickets.
          </p>
        </div>

        {/* Dashboard Tabs Toggle */}
        <div className="flex bg-slate-800 border border-slate-700 p-1 rounded-xl self-start md:self-center">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'inventory' 
                ? 'bg-indigo-600 text-white font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Inventory Stock CRUD
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
              activeTab === 'orders' 
                ? 'bg-indigo-600 text-white font-bold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Client Orders & Tickets
          </button>
        </div>
      </div>

      {/* ==========================================
          TAB 1: INVENTORY CRUD PANEL
          ========================================== */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create/Update Form */}
          <div className="lg:col-span-1 glass-panel rounded-3xl p-6 h-fit">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider pb-3 border-b border-slate-700/60">
              {isEditing ? 'Update GABA Stock' : 'Add New GABA Stock'}
            </h3>

            <form onSubmit={handleSubmitProduct} className="space-y-4">
              {/* Product ID */}
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">Product ID</label>
                <input
                  type="text"
                  placeholder="E.g. GABA-M-21 (Auto-generated if empty)"
                  value={prodId}
                  onChange={(e) => setProdId(e.target.value)}
                  disabled={isEditing}
                  className="w-full bg-slate-900 border border-slate-700 disabled:opacity-50 disabled:bg-slate-950 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-normal text-xs"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="GABA Cotton Slim Fit Trousers"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-normal text-xs"
                />
              </div>

              {/* Category & Fabric */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-350 focus:outline-none font-normal text-xs"
                  >
                    <option value="Men" className="bg-slate-900">Men</option>
                    <option value="Women" className="bg-slate-900">Women</option>
                    <option value="Unisex" className="bg-slate-900">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">Fabric *</label>
                  <input
                    type="text"
                    required
                    placeholder="Linen Blend"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-normal text-xs"
                  />
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="1299"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-normal text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">Stock Qty *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="50"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-normal text-xs"
                  />
                </div>
              </div>

              {/* Sizes checkboxes */}
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1.5">Sizes Available *</label>
                <div className="flex gap-3">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => {
                    const checked = sizes.includes(size);
                    return (
                      <label key={size} className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleSizeCheckbox(size)}
                          className="accent-indigo-500 rounded border-slate-700 bg-slate-900"
                        />
                        <span className="font-mono text-xs">{size}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Image Selection Toggle & Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">Image Source</label>
                  <select
                    value={imageSource}
                    onChange={(e) => setImageSource(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-350 focus:outline-none font-normal text-xs"
                  >
                    <option value="url">Web URL</option>
                    <option value="upload">Upload File</option>
                  </select>
                </div>
                <div>
                  {imageSource === 'url' ? (
                    <>
                      <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">Image URL</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 font-normal text-xs"
                      />
                    </>
                  ) : (
                    <>
                      <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">
                        {uploading ? 'Uploading...' : 'Choose Image File'}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-slate-300 focus:outline-none text-[11px] font-normal cursor-pointer file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 disabled:opacity-50"
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Live Image Preview */}
              {imageUrl && (
                <div className="mt-2 flex items-center gap-3 bg-slate-900/50 p-2.5 rounded-xl border border-slate-700/40">
                  <img src={imageUrl} alt="preview" className="w-9 h-12 object-cover rounded bg-slate-950 border border-slate-800" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Image Preview</span>
                    <span className="text-[10px] text-indigo-400 truncate block font-mono">{imageUrl}</span>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-slate-400 mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Enter garment details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-normal text-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-3 border border-slate-700 hover:bg-slate-700 rounded-xl text-slate-300 font-bold transition-all text-xs"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className="flex-2 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-xs flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  {isEditing ? 'Save Changes' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>

          {/* Inventory List (2 cols) */}
          <div className="lg:col-span-2 glass-panel rounded-3xl p-6 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-6">
              <span className="text-sm font-bold uppercase tracking-wider text-white">Stock List ({products.length} Products)</span>
              <button onClick={fetchProducts} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Reload
              </button>
            </div>

            {loadingProducts ? (
              <div className="text-center py-20">
                <div className="w-7 h-7 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left divide-y divide-slate-800">
                  <thead>
                    <tr className="text-slate-400 uppercase tracking-wider text-[10px] pb-4">
                      <th className="pb-3 pr-2">ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Fabric</th>
                      <th className="pb-3">Price</th>
                      <th className="pb-3">Stock</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-normal">
                    {products.map(p => (
                      <tr key={p.Product_ID} className="hover:bg-slate-800/10 text-xs">
                        <td className="py-3 font-mono font-bold text-indigo-300 pr-2">{p.Product_ID}</td>
                        <td className="py-3 font-bold text-white truncate max-w-[150px]">{p.Product_Name}</td>
                        <td className="py-3">{p.Category}</td>
                        <td className="py-3 text-slate-400 truncate max-w-[80px]">{p.Fabric_Quality}</td>
                        <td className="py-3 font-semibold text-slate-200">{formatPrice(p.Price)}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.Stock_Quantity <= 15 
                              ? 'bg-rose-500/10 text-rose-400' 
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}>
                            {p.Stock_Quantity} units
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleEditClick(p)}
                              className="p-1.5 hover:bg-slate-800 hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
                              title="Edit item"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.Product_ID)}
                              className="p-1.5 hover:bg-slate-800 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          TAB 2: CLIENT ORDERS & RETURN TICKETS
          ========================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-6">
              <span className="text-sm font-bold uppercase tracking-wider text-white">Client Order Log</span>
              <button onClick={fetchOrders} className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Sync Tickets
              </button>
            </div>

            {loadingOrders ? (
              <div className="text-center py-20">
                <div className="w-7 h-7 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-slate-500 font-normal">
                No purchases have been logged on the GABA network yet.
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.Order_ID} className="bg-slate-800/20 border border-slate-800 rounded-2xl p-5 space-y-4">
                    {/* Order header row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-3 text-slate-400 text-[11px]">
                      <div>
                        <span>Ref: <strong className="text-white font-mono font-bold">#GABA-{order.Order_ID}</strong></span>
                        <span className="mx-2">•</span>
                        <span>Client: <strong className="text-white font-bold">{order.Name}</strong> ({order.Email})</span>
                        <span className="mx-2">•</span>
                        <span>Date: <strong className="text-slate-300 font-normal">{new Date(order.Created_At).toLocaleDateString()}</strong></span>
                      </div>
                      
                      {/* Update status selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Set Stage:</span>
                        <select
                          value={order.Status}
                          onChange={(e) => handleUpdateOrderStatus(order.Order_ID, e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg py-1 px-2.5 text-slate-300 text-[11px] font-bold focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Items list */}
                    <div className="space-y-3 font-normal">
                      {order.Items && order.Items.map(item => (
                        <div key={item.OrderItem_ID} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          {/* Item overview */}
                          <div className="flex items-center gap-3">
                            <img src={item.Image_URL} alt="" className="w-8 h-10 object-cover rounded bg-slate-900" />
                            <div>
                              <h4 className="font-bold text-slate-200 leading-tight">{item.Product_Name}</h4>
                              <span className="text-[10px] text-slate-500">Size: {item.Size} | Qty: {item.Quantity} | Price: {formatPrice(item.Price)}</span>
                            </div>
                          </div>

                          {/* Ticket approvals */}
                          <div className="flex items-center">
                            {/* Check if item has return/exchange ticket */}
                            {item.Return_Exchange_Status !== 'None' && (
                              <div className="flex flex-wrap items-center gap-3 bg-slate-900/40 p-2.5 rounded-xl border border-slate-800">
                                
                                {/* Ticket details */}
                                <div className="text-left">
                                  <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                                    item.Return_Exchange_Status.includes('Approved') 
                                      ? 'bg-green-500/10 text-green-400' 
                                      : item.Return_Exchange_Status.includes('Rejected')
                                        ? 'bg-rose-500/10 text-rose-400'
                                        : 'bg-amber-500/10 text-amber-400'
                                  }`}>
                                    {item.Return_Exchange_Status.replace('_', ' ')}
                                  </span>
                                  {item.Return_Exchange_Reason && (
                                    <span className="block text-[10px] text-slate-400 italic mt-0.5 font-normal">
                                      Reason: "{item.Return_Exchange_Reason}"
                                    </span>
                                  )}
                                </div>

                                {/* Review Buttons (Approve/Reject) */}
                                {(item.Return_Exchange_Status === 'Return_Requested' || item.Return_Exchange_Status === 'Exchange_Requested') && (
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() => handleReviewRequest(item.OrderItem_ID, true)}
                                      className="p-1 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white border border-green-500/20 rounded-lg transition-all cursor-pointer"
                                      title="Approve Ticket"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleReviewRequest(item.OrderItem_ID, false)}
                                      className="p-1 bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white border border-rose-500/20 rounded-lg transition-all cursor-pointer"
                                      title="Reject Ticket"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
