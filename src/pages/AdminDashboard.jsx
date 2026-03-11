import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Search, Filter, MessageSquare, Send, Bell, Code2, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const [editingOrder, setEditingOrder] = useState(null);
    const [updateStatus, setUpdateStatus] = useState('');
    const [adminResponse, setAdminResponse] = useState('');

    const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'chat'
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchOrders();
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/orders', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateClick = (order) => {
        setEditingOrder(order._id);
        setUpdateStatus(order.status);
        setAdminResponse(order.adminResponse || '');
    };

    const handleUpdateSubmit = async (orderId) => {
        try {
            await axios.put(`/api/orders/${orderId}/status`,
                { status: updateStatus, adminResponse },
                { headers: { Authorization: `Bearer ${user.token}` } });
            setEditingOrder(null);
            fetchOrders();
        } catch (error) {
            console.error(error);
            alert('Failed to update order');
        }
    };

    const fetchMessages = async (orderId) => {
        try {
            const { data } = await axios.get(`/api/messages/${orderId}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setMessages(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleOpenChat = (order) => {
        setSelectedOrder(order);
        setActiveTab('chat');
        fetchMessages(order._id);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedOrder) return;

        try {
            const { data } = await axios.post('/api/messages', {
                orderId: selectedOrder._id,
                receiverId: selectedOrder.userId._id, // Send back to the user who made the order
                message: newMessage
            }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });

            setMessages([...messages, { ...data, senderId: { _id: user._id, name: user.name, role: user.role } }]);
            setNewMessage('');
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error(error);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'Viewed': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Accepted': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'In Progress': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'Completed': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.userId?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.userId?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.companyName && order.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="flex h-screen bg-[#0f172a] text-white overflow-hidden">

            {/* Sidebar Setup */}
            <div className="w-64 bg-[#0f172a] border-r border-white/5 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-white/5">
                    <Link to="/" className="flex items-center space-x-2 w-fit group">
                        <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-[10px] shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                            <Code2 className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">
                            WebDev<span className="text-indigo-400">Pro</span>
                        </span>
                    </Link>
                </div>

                <div className="p-4 flex-grow space-y-2">
                    <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-4 px-3 flex items-center">
                        <Database className="w-3 h-3 mr-2" />
                        Admin Terminal
                    </div>

                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'orders' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.1)]' : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}`}
                    >
                        <Search size={16} />
                        <span>Global Monitor</span>
                    </button>
                </div>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4 px-2">
                        <div className="text-xs font-bold text-emerald-400 flex items-center">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></div>
                            System Online
                        </div>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="w-full text-center py-2.5 rounded-lg text-xs font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors uppercase tracking-wider"
                    >
                        Disconnect
                    </button>
                </div>
            </div>

            {/* Main Content Pane */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-[#0f172a]">
                    <span className="font-bold text-xl text-white">Admin<span className="text-indigo-400">Terminal</span></span>
                    <button onClick={() => { logout(); navigate('/'); }} className="text-xs text-gray-400 font-bold uppercase tracking-wider">EXIT</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-10 w-full max-w-screen-2xl mx-auto">

                    {activeTab === 'orders' ? (
                        <>
                            <div className="flex flex-col xl:flex-row xl:items-end justify-between mb-8 pb-6 border-b border-white/5 gap-6">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center">
                                        <span className="w-1.5 h-6 bg-indigo-500 mr-3 rounded-full"></span>
                                        Global Monitor
                                    </h1>
                                    <p className="mt-2 text-sm text-gray-400 pl-4.5 font-medium tracking-wide">
                                        Command center for client deployment requests.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                        <input
                                            type="text"
                                            placeholder="Search cluster..."
                                            className="pl-9 pr-4 py-2 bg-[#0f172a] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-64 placeholder-gray-600 shadow-inner"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="relative">
                                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                        <select
                                            className="pl-9 pr-8 py-2 bg-[#0f172a] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none font-medium shadow-inner"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                        >
                                            <option value="All">All Tiers</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Viewed">Viewed</option>
                                            <option value="Accepted">Accepted</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
                                </div>
                            ) : filteredOrders.length === 0 ? (
                                <div className="bg-[#0f172a] rounded-2xl p-12 text-center border border-white/5 shadow-2xl">
                                    <p className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Cluster Empty</p>
                                </div>
                            ) : (
                                <div className="bg-[#0f172a] shadow-2xl rounded-2xl border border-white/5 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-white/5">
                                            <thead className="bg-[#1e293b]/50">
                                                <tr>
                                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Client</th>
                                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Architecture</th>
                                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Build Status</th>
                                                    <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">Initiated</th>
                                                    <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Execute</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-[#0f172a] divide-y divide-white/5">
                                                {filteredOrders.map((order) => (
                                                    <tr key={order._id} className="hover:bg-[#1e293b]/50 transition-colors">
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex-shrink-0 h-10 w-10 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 font-bold text-base shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                                                                    {order.userId?.name?.charAt(0) || 'U'}
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-bold text-white">{order.userId?.name}</div>
                                                                    <div className="text-[11px] uppercase tracking-wider text-gray-500 mt-1">{order.companyName ? order.companyName : "Personal"}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <div className="text-sm text-indigo-300 capitalize font-bold">{order.plan}</div>
                                                            <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mt-1">{order.pages} PG • ₹{order.budget.toLocaleString()}</div>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap">
                                                            <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded border ${getStatusBadge(order.status)}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-xs font-medium text-gray-500">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                            <button
                                                                onClick={() => handleUpdateClick(order)}
                                                                className="text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded transition-all font-bold text-xs uppercase tracking-wider"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenChat(order)}
                                                                className="text-white hover:text-white primary-btn px-3 py-1.5 rounded transition-transform hover:scale-105 font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] inline-flex items-center text-xs uppercase tracking-wider"
                                                            >
                                                                Link
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-[#0f172a] rounded-3xl shadow-2xl border border-white/5 overflow-hidden flex flex-col md:flex-row h-[80vh] min-h-[600px]">

                            {/* Context Sidebar */}
                            <div className="w-full md:w-80 bg-[#0a0f1d] border-r border-white/5 p-6 overflow-y-auto hidden md:block">
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className="text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 mb-8 flex items-center transition-colors"
                                >
                                    &larr; Abort Link
                                </button>

                                <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-2">Target Metrics</h3>
                                <div className="space-y-6 mb-8">
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">ID Array</p>
                                        <p className="font-semibold text-white mt-1">{selectedOrder?.userId?.name}</p>
                                        <a href={`mailto:${selectedOrder?.userId?.email}`} className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">{selectedOrder?.userId?.email}</a>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-6 border-b border-white/5 pb-2 flex justify-between items-center">
                                    Environment
                                    <button
                                        onClick={() => handleUpdateClick(selectedOrder)}
                                        className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded font-bold uppercase tracking-wider transition-colors hover:bg-indigo-500/20"
                                    >Override</button>
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Build Status</p>
                                        <span className={`mt-1.5 inline-flex items-center px-2.5 py-1 rounded border text-xs font-bold ${getStatusBadge(selectedOrder?.status)}`}>
                                            {selectedOrder?.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Instance Name</p>
                                        <p className="font-semibold text-white mt-1">{selectedOrder?.companyName || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Config</p>
                                        <p className="font-semibold text-white mt-1 capitalize">{selectedOrder?.websiteType || 'N/A'} ({selectedOrder?.plan})</p>
                                        <p className="text-indigo-400 text-sm font-bold mt-1">₹{selectedOrder?.budget.toLocaleString()} • {selectedOrder?.pages} PG</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Sys Log</p>
                                        <p className="text-xs text-gray-400 bg-[#1e293b]/50 p-3 rounded-lg border border-white/5 mt-1.5 leading-relaxed">{selectedOrder?.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Window */}
                            <div className="flex-1 flex flex-col h-full relative">
                                <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between bg-[#0f172a] z-10 w-full shadow-sm">
                                    <div>
                                        <h3 className="font-bold text-white flex items-center text-sm md:text-base">
                                            <Code2 size={18} className="mr-2 text-indigo-400" />
                                            Comm Link Active
                                        </h3>
                                    </div>
                                    <button onClick={() => setActiveTab('orders')} className="md:hidden text-xs text-indigo-400 font-bold uppercase tracking-wider">
                                        Close
                                    </button>
                                </div>

                                <div className="flex-grow p-4 sm:p-6 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-[#0a0f1d] relative">
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0f1d] opacity-50 z-0"></div>

                                    <div className="relative z-10 w-full">
                                        {messages.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-gray-500 py-10">
                                                <MessageSquare size={32} className="mb-4 text-gray-600" />
                                                <p className="text-sm font-medium">Link established. Awaiting input.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {messages.map((msg, idx) => {
                                                    const isMe = msg.senderId._id === user._id || msg.senderId.role === 'admin';
                                                    return (
                                                        <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                            <div className={`px-4 py-3 max-w-[85%] sm:max-w-[75%] rounded-2xl ${isMe ? 'bg-indigo-600 text-white rounded-br-sm shadow-[0_4px_15px_rgba(79,70,229,0.3)]' : 'bg-[#1e293b] text-gray-200 rounded-bl-sm border border-white/5 shadow-md'}`}>
                                                                <p className="text-sm leading-relaxed">{msg.message}</p>
                                                            </div>
                                                            <span className="text-[9px] font-bold tracking-wider text-gray-500 mt-1.5 px-1 uppercase">
                                                                {isMe ? 'ENG' : 'CLIENT'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                                <div ref={messagesEndRef} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#0f172a] border-t border-white/5 relative z-10">
                                    <form onSubmit={handleSendMessage} className="flex relative items-center">
                                        <input
                                            type="text"
                                            required
                                            placeholder="Execute generic string to client..."
                                            className="w-full bg-[#1e293b] border border-white/10 text-white rounded-xl pl-4 pr-14 py-3 sm:py-3.5 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all text-sm placeholder-gray-600 block"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="absolute right-2 p-2 sm:p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors disabled:bg-slate-700 disabled:text-gray-500 disabled:cursor-not-allowed shadow"
                                        >
                                            <Send size={16} className="ml-0.5" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Edit Modal Override */}
                    {editingOrder && (
                        <div className="fixed z-[100] inset-0 overflow-y-auto">
                            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <div className="fixed inset-0 bg-[#0f172a]/80 backdrop-blur-md transition-opacity" onClick={() => setEditingOrder(null)}></div>

                                <div className="inline-block align-bottom bg-[#0f172a] rounded-2xl text-left overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.2)] transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-white/10">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[50px]"></div>
                                    <div className="px-8 pt-8 pb-6 relative z-10">
                                        <h3 className="text-xl font-bold leading-6 text-white mb-6 border-b border-white/10 pb-4">
                                            System Override
                                        </h3>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Build Phase</label>
                                                <select
                                                    className="w-full bg-[#1e293b] border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all font-medium appearance-none shadow-inner"
                                                    value={updateStatus}
                                                    onChange={(e) => setUpdateStatus(e.target.value)}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Viewed">Viewed</option>
                                                    <option value="Accepted">Accepted</option>
                                                    <option value="Rejected">Rejected</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Automated Alert Msg</label>
                                                <textarea
                                                    className="w-full bg-[#1e293b] border border-white/10 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none shadow-inner text-sm placeholder-gray-600"
                                                    rows="4"
                                                    placeholder="Broadcast message to client dashboard..."
                                                    value={adminResponse}
                                                    onChange={(e) => setAdminResponse(e.target.value)}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-[#0a0f1d] px-8 py-4 sm:flex sm:flex-row-reverse border-t border-white/5 relative z-10">
                                        <button
                                            type="button"
                                            className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-[0_0_15px_rgba(79,70,229,0.3)] px-6 py-2.5 primary-btn text-sm font-bold text-white focus:outline-none sm:ml-3 sm:w-auto transition-transform hover:scale-[1.02]"
                                            onClick={() => {
                                                handleUpdateSubmit(editingOrder);
                                                if (selectedOrder && selectedOrder._id === editingOrder) {
                                                    setSelectedOrder({ ...selectedOrder, status: updateStatus, adminResponse: adminResponse });
                                                }
                                            }}
                                        >
                                            Commit
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 w-full inline-flex justify-center rounded-xl border border-white/10 px-6 py-2.5 bg-[#1e293b] text-sm font-bold text-gray-300 hover:bg-[#1e293b]/70 hover:text-white focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto transition-colors"
                                            onClick={() => setEditingOrder(null)}
                                        >
                                            Abort
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
