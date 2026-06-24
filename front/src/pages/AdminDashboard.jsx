import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ProductContext } from '../context/ProductContext';
import { Plus, Edit3, Trash2, ShieldAlert, BarChart3, Package, FileText, CheckCircle2, Truck, HelpCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { products, fetchProducts, createProduct, updateProduct, deleteProduct } = useContext(ProductContext);

  const [activeTab, setActiveTab] = useState('metrics'); // Tabs: metrics, products, orders
  
  // Dashboard indicators state
  const [metrics, setMetrics] = useState({
    totalOrders: 0,
    productsCount: 0,
    usersCount: 0,
    totalRevenue: 0,
    lowStockProducts: [],
  });
  const [metricsLoading, setMetricsLoading] = useState(true);

  // Orders list state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Product CRUD Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [targetId, setTargetId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    description: '',
    category: 'Suits & Blazers',
    images: [''],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Onyx'],
    stock: 0,
  });

  const fetchMetrics = async () => {
    try {
      setMetricsLoading(true);
      const response = await fetch('/api/orders/metrics', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setMetrics(data);
      }
      setMetricsLoading(false);
    } catch (err) {
      console.error(err);
      setMetricsLoading(false);
    }
  };

  const fetchAllOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      }
      setOrdersLoading(false);
    } catch (err) {
      console.error(err);
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchMetrics();
    fetchAllOrders();
  }, []);

  const handleUpdateDeliverStatus = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.ok) {
        fetchAllOrders();
        fetchMetrics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setFormData({
      name: '',
      price: 0,
      description: '',
      category: 'Suits & Blazers',
      images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600&auto=format&fit=crop'],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Onyx'],
      stock: 10,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditMode(true);
    setTargetId(prod._id);
    setFormData({
      name: prod.name,
      price: prod.price,
      description: prod.description,
      category: prod.category,
      images: prod.images,
      sizes: prod.sizes,
      colors: prod.colors,
      stock: prod.stock,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (prodId) => {
    if (window.confirm('Are you sure you want to remove this premium piece?')) {
      const success = await deleteProduct(prodId, user.token);
      if (success) {
        fetchMetrics();
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let success = false;
    
    if (editMode) {
      success = await updateProduct(targetId, formData, user.token);
    } else {
      success = await createProduct(formData, user.token);
    }

    if (success) {
      setIsModalOpen(false);
      fetchMetrics();
    }
  };

  return (
    <div style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '3rem 2rem' }} className="animate-fade">
      
      {/* Header Banner */}
      <div style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '2rem' }}>
        <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-display)', color: 'var(--color-accent)', letterSpacing: '4px' }}>ADMINISTRATIVE HEADQUARTERS</span>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800 }}>GABA ATELIER CONTROL</h1>
      </div>

      {/* Tabs controllers */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.2rem', marginBottom: '3rem' }}>
        <button
          onClick={() => setActiveTab('metrics')}
          className={activeTab === 'metrics' ? 'gold-btn' : 'outline-btn'}
          style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem' }}
        >
          <BarChart3 size={14} /> METRICS WIDGET
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={activeTab === 'products' ? 'gold-btn' : 'outline-btn'}
          style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem' }}
        >
          <Package size={14} /> INVENTORY CRUD
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={activeTab === 'orders' ? 'gold-btn' : 'outline-btn'}
          style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem' }}
        >
          <FileText size={14} /> ORDERS FULFILLMENT
        </button>
      </div>

      {/* TABS VIEW PANEL */}

      {/* TAB 1: METRICS */}
      {activeTab === 'metrics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {metricsLoading ? (
            <div style={{ color: 'var(--color-accent)' }}>CALCULATING REVENUE AND ORDER METRICS...</div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '2rem',
            }}>
              {/* Metrics 1 */}
              <div className="glass-panel animate-scale" style={{ padding: '2rem', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>TOTAL REVENUE</span>
                <strong className="gold-gradient-text" style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                  ${metrics.totalRevenue.toFixed(2)}
                </strong>
              </div>

              {/* Metrics 2 */}
              <div className="glass-panel animate-scale" style={{ padding: '2rem', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>TOTAL SALES COUNT</span>
                <strong style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-text-light)' }}>
                  {metrics.totalOrders}
                </strong>
              </div>

              {/* Metrics 3 */}
              <div className="glass-panel animate-scale" style={{ padding: '2rem', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>DEDICATED STORES</span>
                <strong style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-text-light)' }}>
                  {metrics.productsCount}
                </strong>
              </div>

              {/* Metrics 4 */}
              <div className="glass-panel animate-scale" style={{ padding: '2rem', borderRadius: '4px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', letterSpacing: '1px', display: 'block', marginBottom: '0.5rem' }}>REGISTERED GUESTS</span>
                <strong style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--color-text-light)' }}>
                  {metrics.usersCount}
                </strong>
              </div>
            </div>
          )}

          {/* Low Stock Alerts block */}
          <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '4px' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
            }}>
              <ShieldAlert size={20} /> PRIMARY VAULT LOW-STOCK WARNINGS
            </h3>
            {metrics.lowStockProducts.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                All premium catalog inventory levels are stable. No low-stock conditions detected.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {metrics.lowStockProducts.map((p) => (
                  <div key={p._id} style={{
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '2px',
                    padding: '1rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <strong style={{ fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: '75%' }}>{p.name}</strong>
                    <span style={{ background: '#ef4444', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '2px' }}>
                      {p.stock} LEFT
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS INVENTORY CRUD */}
      {activeTab === 'products' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-accent)' }}>PRODUCTS INVENTORY LIST</h3>
            <button onClick={openCreateModal} className="gold-btn" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem' }}>
              <Plus size={16} /> ADD NEW APPAREL
            </button>
          </div>

          {/* Table display */}
          <div className="glass-panel" style={{ overflowX: 'auto', borderRadius: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '1.2rem' }}>GARMENT ITEM</th>
                  <th style={{ padding: '1.2rem' }}>CATEGORY</th>
                  <th style={{ padding: '1.2rem' }}>PRICE</th>
                  <th style={{ padding: '1.2rem' }}>STOCK STATUS</th>
                  <th style={{ padding: '1.2rem', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.9rem', hover: 'background: rgba(255,255,255,0.01)' }} className="crud-row">
                    <td style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={prod.images[0]} alt={prod.name} style={{ width: '35px', height: '42px', objectFit: 'cover', borderRadius: '2px' }} />
                      <strong style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{prod.name}</strong>
                    </td>
                    <td style={{ padding: '1.2rem', color: 'var(--color-text-muted)' }}>{prod.category}</td>
                    <td style={{ padding: '1.2rem', fontWeight: 600 }}>${prod.price.toFixed(2)}</td>
                    <td style={{ padding: '1.2rem' }}>
                      {prod.stock <= 5 ? (
                        <span style={{ color: '#ef4444', fontWeight: 600 }}>{prod.stock} left (Critical)</span>
                      ) : (
                        <span style={{ color: '#4caf50' }}>{prod.stock} units</span>
                      )}
                    </td>
                    <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => openEditModal(prod)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-light)', hover: 'color: var(--color-accent)' }}>
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDeleteProduct(prod._id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', hover: 'color: #ef4444' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DYNAMIC CRUD MODAL OVERLAY */}
          {isModalOpen && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(3,6,12,0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
            }}>
              <div className="glass-panel animate-scale" style={{
                padding: '2.5rem',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid var(--color-accent)',
              }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-accent)', marginBottom: '2rem', textAlign: 'center' }}>
                  {editMode ? 'UPDATE PREMIUM GARMENT' : 'CATALOG NEW LUXURY GARMENT'}
                </h3>

                <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>GARMENT TITLE</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem', color: '#fff', width: '100%', outline: 'none' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>PRICE ($)</label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem', color: '#fff', width: '100%', outline: 'none' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>STOCK QUANTITY</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem', color: '#fff', width: '100%', outline: 'none' }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>CATEGORY</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      style={{ background: 'var(--color-primary)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem', color: '#fff', width: '100%', outline: 'none' }}
                    >
                      <option value="Suits & Blazers">Suits & Blazers</option>
                      <option value="Shirts">Shirts</option>
                      <option value="Dresses">Dresses</option>
                      <option value="Outerwear">Outerwear</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>PRODUCT IMAGE URL</label>
                    <input
                      type="text"
                      value={formData.images[0]}
                      onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem', color: '#fff', width: '100%', outline: 'none' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>DESCRIPTION</label>
                    <textarea
                      rows="3"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem', color: '#fff', width: '100%', outline: 'none', resize: 'none' }}
                      required
                    ></textarea>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="outline-btn" style={{ flex: 1, justifyContent: 'center' }}>
                      CANCEL
                    </button>
                    <button type="submit" className="gold-btn" style={{ flex: 1, justifyContent: 'center' }}>
                      {editMode ? 'UPDATE GARMENT' : 'SUBMIT CATALOG'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ORDERS FULFILLMENT CENTER */}
      {activeTab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-accent)' }}>Fulfilment Logistic Management</h3>
          
          {ordersLoading ? (
            <div style={{ color: 'var(--color-accent)' }}>LOADING ORDERS DATABASE...</div>
          ) : orders.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: '4px' }}>
              <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No orders have been registered in the system database.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {orders.map((ord) => (
                <div key={ord._id} className="glass-panel animate-scale" style={{ padding: '2rem', borderRadius: '4px' }}>
                  
                  {/* Fulfiller info rows */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    paddingBottom: '1rem',
                    marginBottom: '1.5rem',
                    fontSize: '0.85rem',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>INVOICE / ID</span>
                      <strong style={{ fontFamily: 'monospace' }}>{ord._id}</strong>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginX: '1rem' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>BUYER CUSTOMER</span>
                      <strong>{ord.user?.name || 'Guest User'} ({ord.user?.email || 'N/A'})</strong>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>FUNDS PAID?</span>
                      {ord.isPaid ? (
                        <strong style={{ color: '#4caf50' }}>YES — MOCK CHARGED</strong>
                      ) : (
                        <strong style={{ color: '#ef4444' }}>UNPAID TRANSACTION</strong>
                      )}
                    </div>
                  </div>

                  {/* Shipment triggers and products list */}
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1.5rem',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flexGrow: 1 }}>
                      {ord.orderItems.map((item, idx) => (
                        <div key={idx} style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          • {item.name} <strong style={{ color: '#fff' }}>({item.size} / {item.color} x{item.qty})</strong> — ${(item.price * item.qty).toFixed(2)}
                        </div>
                      ))}
                    </div>

                    {/* Logistics click updater */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexShrink: 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>SHIPPING STATUS</span>
                        <strong style={{
                          color: ord.orderStatus === 'Delivered' ? '#4caf50' : ord.orderStatus === 'Shipped' ? 'var(--color-accent)' : '#ef4444',
                        }}>
                          {ord.orderStatus.toUpperCase()}
                        </strong>
                      </div>

                      {ord.orderStatus !== 'Delivered' ? (
                        <button
                          onClick={() => handleUpdateDeliverStatus(ord._id)}
                          className="gold-btn"
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.5rem 1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          {ord.orderStatus === 'Processing' ? (
                            <>
                              <Truck size={14} /> MARK SHIPPED
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={14} /> MARK DELIVERED
                            </>
                          )}
                        </button>
                      ) : (
                        <div style={{
                          color: '#4caf50',
                          border: '1px solid rgba(76,175,80,0.2)',
                          padding: '0.4rem 0.8rem',
                          borderRadius: '2px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}>
                          DELIVERED & CLOSED
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Styled custom CSS inline injection for CRUD tables */}
      <style>{`
        .crud-row:hover {
          background: rgba(255,255,255,0.01) !important;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
