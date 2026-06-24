import React, { useState, useEffect } from 'react';
import { ShoppingBag, RefreshCw, Calendar, CheckCircle2, Truck, HelpCircle, Undo2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function OrderHistory({ onBackToStore }) {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Return/Exchange Request Modal State
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [requestType, setRequestType] = useState('return'); // 'return' or 'exchange'
  const [reason, setReason] = useState('Size not fitting');
  const [submitting, setSubmitting] = useState(false);

  const reasons = [
    'Size not fitting',
    'Received wrong item',
    'Product quality is not up to expectation',
    'Item damaged or defective',
    'Changed my mind'
  ];

  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/orders/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching order history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Open modal for return/exchange
  const handleOpenRequest = (item, type) => {
    setSelectedItem(item);
    setRequestType(type);
    setRequestModalOpen(true);
  };

  // Submit return/exchange request
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    if (!selectedItem || !token) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/orders/items/${selectedItem.OrderItem_ID}/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: requestType,
          reason: reason
        })
      });

      if (res.ok) {
        alert(`${requestType === 'return' ? 'Return' : 'Exchange'} request submitted successfully!`);
        setRequestModalOpen(false);
        fetchOrders(); // Reload orders to update status
      } else {
        const data = await res.json();
        alert(data.message || 'Request submission failed.');
      }
    } catch (err) {
      console.error('Error submitting request:', err);
      alert('Error connecting to server.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/25 px-2 py-0.5 rounded-full font-bold">Pending</span>;
      case 'Shipped':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/25 px-2 py-0.5 rounded-full font-bold">Shipped</span>;
      case 'Delivered':
        return <span className="bg-green-500/10 text-green-400 border border-green-500/25 px-2 py-0.5 rounded-full font-bold">Delivered</span>;
      case 'Cancelled':
        return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/25 px-2 py-0.5 rounded-full font-bold">Cancelled</span>;
      default:
        return <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{status}</span>;
    }
  };

  const getReturnStatusBadge = (status) => {
    switch (status) {
      case 'Return_Requested':
        return <span className="text-amber-400 bg-amber-500/5 border border-amber-500/20 px-2 py-1 rounded-md text-[10px]">Return Requested</span>;
      case 'Return_Approved':
        return <span className="text-green-400 bg-green-500/5 border border-green-500/20 px-2 py-1 rounded-md text-[10px]">Return Approved</span>;
      case 'Return_Rejected':
        return <span className="text-rose-400 bg-rose-500/5 border border-rose-500/20 px-2 py-1 rounded-md text-[10px]">Return Rejected</span>;
      case 'Exchange_Requested':
        return <span className="text-amber-400 bg-amber-500/5 border border-amber-500/20 px-2 py-1 rounded-md text-[10px]">Exchange Requested</span>;
      case 'Exchange_Approved':
        return <span className="text-green-400 bg-green-500/5 border border-green-500/20 px-2 py-1 rounded-md text-[10px]">Exchange Approved</span>;
      case 'Exchange_Rejected':
        return <span className="text-rose-400 bg-rose-500/5 border border-rose-500/20 px-2 py-1 rounded-md text-[10px]">Exchange Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8">
      {/* Back button */}
      <button 
        onClick={onBackToStore}
        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white mb-6 group cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Catalog
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-indigo-400" />
          Your Order History
        </h2>
        <button 
          onClick={fetchOrders}
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-bold"
          title="Refresh orders"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Sync Status
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs text-slate-500 font-semibold">Retrieving your order log from GABA network...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/20 border border-dashed border-slate-700 rounded-3xl">
          <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-300">No Orders Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto font-normal">
            You haven't placed any orders with GABA yet. Head over to the catalogue to find your premium fashion wear.
          </p>
          <button 
            onClick={onBackToStore}
            className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 text-xs font-bold rounded-full transition-all shadow-lg active:scale-95"
          >
            Shop the Collection
          </button>
        </div>
      ) : (
        <div className="space-y-6 text-xs font-semibold text-slate-300">
          {orders.map((order) => (
            <div 
              key={order.Order_ID} 
              className="glass-panel rounded-3xl overflow-hidden border border-slate-700/60 transition-all duration-300 hover:border-slate-650"
            >
              {/* Order Header Summary */}
              <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-800 flex flex-wrap gap-4 items-center justify-between text-slate-400">
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-400/80" />
                    <span>Ordered: <strong className="text-slate-300 font-normal">{new Date(order.Created_At).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</strong></span>
                  </div>
                  <div>
                    <span>Order Ref: <strong className="text-slate-300 font-mono font-bold">#GABA-{order.Order_ID}</strong></span>
                  </div>
                  <div>
                    <span>Total Amount: <strong className="text-indigo-300 font-bold">{formatPrice(order.Total_Amount)}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Delivery Status:</span>
                  {getStatusBadge(order.Status)}
                </div>
              </div>

              {/* Order Items List */}
              <div className="divide-y divide-slate-850 px-6 py-2">
                {order.Items && order.Items.map((item) => (
                  <div 
                    key={item.OrderItem_ID} 
                    className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Item graphic & info */}
                    <div className="flex gap-4 items-center">
                      <img src={item.Image_URL} alt="" className="w-11 h-14 object-cover rounded-lg bg-slate-900 border border-slate-750 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">{item.Product_Name}</h4>
                        <div className="flex gap-2.5 items-center text-[10px] text-slate-400 mt-1 font-normal">
                          <span>Size: <strong className="text-indigo-300 font-mono font-bold">{item.Size}</strong></span>
                          <span>|</span>
                          <span>Qty: <strong className="text-slate-300 font-bold">{item.Quantity}</strong></span>
                          <span>|</span>
                          <span>Price: <strong className="text-slate-300 font-bold">{formatPrice(item.Price)}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Return / Exchange status */}
                    <div className="flex flex-wrap items-center gap-3">
                      {item.Return_Exchange_Status === 'None' ? (
                        // Only allow Return/Exchange if order is Delivered
                        order.Status === 'Delivered' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenRequest(item, 'return')}
                              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[10px] font-bold rounded-lg text-slate-300 hover:text-white transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                            >
                              <Undo2 className="w-3.5 h-3.5 text-indigo-400" />
                              Return
                            </button>
                            <button
                              onClick={() => handleOpenRequest(item, 'exchange')}
                              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[10px] font-bold rounded-lg text-slate-300 hover:text-white transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3 text-purple-400" />
                              Exchange
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-normal italic flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
                            Returnable upon delivery
                          </span>
                        )
                      ) : (
                        getReturnStatusBadge(item.Return_Exchange_Status)
                      )}
                    </div>

                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Return/Exchange Prompt Modal */}
      {requestModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadein text-xs font-semibold text-slate-300">
          <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl p-6 relative animate-slideup">
            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">
              File {requestType === 'return' ? 'Return Request' : 'Exchange Request'}
            </h3>
            <p className="text-[10px] text-slate-400 font-normal leading-relaxed mb-4">
              We are sorry your item wasn't perfect. Please select a reason for request review. Our admin will examine the ticket shortly.
            </p>

            <form onSubmit={handleSubmitRequest} className="space-y-4">
              {/* Product preview */}
              <div className="flex gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
                <img src={selectedItem.Image_URL} alt="" className="w-8 h-10 object-cover rounded-lg bg-slate-950" />
                <div>
                  <h4 className="text-[11px] font-bold text-white">{selectedItem.Product_Name}</h4>
                  <span className="text-[10px] text-slate-400 font-normal">Size: {selectedItem.Size} | Price: {formatPrice(selectedItem.Price)}</span>
                </div>
              </div>

              {/* Reasons Dropdown */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">Reason for {requestType}</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-300 focus:outline-none focus:border-indigo-500 font-normal text-xs"
                >
                  {reasons.map((r, i) => (
                    <option key={i} value={r} className="bg-slate-900">{r}</option>
                  ))}
                </select>
              </div>

              {/* CTA Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRequestModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 text-slate-400 hover:text-white rounded-xl text-xs hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/10 active:scale-95 transition-all"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
