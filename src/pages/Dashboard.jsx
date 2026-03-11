import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { Package, PlusCircle, CheckCircle, Clock, XCircle, FileText, MessageSquare, Send, Code2, LogOut, Phone, CreditCard, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Core Tabs: 'orders', 'new', 'chat'
    const [activeTab, setActiveTab] = useState('orders');

    // Wizard Flow States for 'new' tab: 1: Form, 2: Summary, 3: Payment UI, 4: Success
    const [wizardStep, setWizardStep] = useState(1);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitError, setSubmitError] = useState('');

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const [formData, setFormData] = useState({
        plan: 'basic',
        phoneNumber: '',
        companyName: '',
        businessType: '',
        websiteType: '',
        pages: 3,
        description: '',
        addons: [],
        features: [],
        deliveryOption: 'normal',
        budget: 3000
    });

    // Delivery Multiplier Logic
    const deliveryPricing = {
        normal: { price: 0, label: 'Normal Delivery' },
        fast: { price: 4000, label: '2x Faster Delivery' },
        urgent: { price: 8000, label: '3x Urgent Delivery' }
    };

    const websiteFeaturesList = [
        'Homepage design', 'Contact form', 'User login system',
        'Admin login', 'Payment gateway', 'Blog system',
        'Image gallery', 'Dashboard', 'SEO setup',
        'Analytics integration'
    ];

    // Addon options definitions
    const addonOptions = [
        { id: 'payment', name: 'Payment Gateway Integration', price: 1500, desc: 'Stripe or Razorpay securely integrated.' },
        { id: 'seo', name: 'Advanced SEO Optimization', price: 0, desc: 'Dynamic pricing depending on pages. (Quoted later)' },
        { id: 'admin', name: 'Custom Admin Dashboard', price: 60000, desc: 'Full backend portal to manage users and data.' }
    ];

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (user.role === 'admin') {
            navigate('/admin-dashboard');
            return;
        }

        const params = new URLSearchParams(location.search);
        const planParam = params.get('plan');
        if (planParam) {
            setActiveTab('new');
            setWizardStep(1);

            let baseCost = 3000;
            let pagesCount = 3;
            if (planParam === 'standard') { baseCost = 7000; pagesCount = 7; }
            else if (planParam === 'premium') { baseCost = 50000; pagesCount = 20; }

            setFormData(prev => ({ ...prev, plan: planParam, budget: baseCost, pages: pagesCount }));
        }

        fetchOrders();
    }, [user, navigate, location]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/orders/myorders', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setOrders(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate dynamic budget when add-ons or plan or delivery changes
    useEffect(() => {
        let baseCost = 3000;
        if (formData.plan === 'standard') baseCost = 7000;
        if (formData.plan === 'premium') baseCost = 50000;

        let addonsCost = 0;
        if (formData.addons.includes('payment')) addonsCost += 1500;
        if (formData.addons.includes('admin')) addonsCost += 60000;

        let deliveryCost = deliveryPricing[formData.deliveryOption].price;

        // Premium base scales up delivery slightly differently, but flat is also okay based on formula:
        if (formData.plan === 'premium') {
            deliveryCost *= 2.5; // Premium apps cost more to expedite
        }

        setFormData(prev => ({ ...prev, budget: baseCost + addonsCost + deliveryCost }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formData.plan, formData.addons, formData.deliveryOption]);

    const handleAddonToggle = (addonId) => {
        setFormData(prev => {
            const hasAddon = prev.addons.includes(addonId);
            return {
                ...prev,
                addons: hasAddon ? prev.addons.filter(a => a !== addonId) : [...prev.addons, addonId]
            }
        });
    };

    const handleFeatureToggle = (featureId) => {
        setFormData(prev => {
            const hasFeature = prev.features.includes(featureId);
            return {
                ...prev,
                features: hasFeature ? prev.features.filter(a => a !== featureId) : [...prev.features, featureId]
            }
        });
    };

    const handleNextStep = (e) => {
        e.preventDefault();
        setWizardStep(2); // Go to summary
    };

    // Step 3 triggers the backend creation, but visually acts as "processing payment"
    const handleProceedToPayment = () => {
        setWizardStep(3);
    };

    const handleProcessPayment = async () => {
        setSubmitError('');
        try {
            await axios.post('/api/orders', formData, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // Simulate payment processing time
            setTimeout(() => {
                setWizardStep(4);
            }, 1500);
        } catch (error) {
            setSubmitError(error.response?.data?.message || 'Failed to submit order');
            setWizardStep(2); // kick back to summary on error
        }
    };

    const resetWizard = () => {
        setActiveTab('orders');
        setWizardStep(1);
        fetchOrders();
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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'Viewed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'Accepted': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
            case 'Rejected': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'In Progress': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'Completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    const statusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle size={14} className="mr-1.5" />;
            case 'Rejected': return <XCircle size={14} className="mr-1.5" />;
            default: return <Clock size={14} className="mr-1.5" />;
        }
    };

    return (
        <div className="flex bg-[#0f172a] h-screen overflow-hidden dark">
            {/* Sidebar Navigation */}
            <div className="w-64 bg-[#1e293b] border-r border-[#334155] flex flex-col hidden md:flex">
                <div className="p-6 border-b border-[#334155]">
                    <Link to="/" className="flex items-center space-x-2 w-fit group">
                        <div className="p-2 bg-blue-600 rounded-xl shadow-sm">
                            <Code2 className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">
                            WebDev<span className="text-blue-500">Pro</span>
                        </span>
                    </Link>
                </div>

                <div className="p-4 flex-grow space-y-2">
                    <div className="text-xs uppercase tracking-wider font-bold text-slate-400 mb-4 px-3">Client Portal</div>

                    <button
                        onClick={() => { setActiveTab('orders'); setWizardStep(1); }}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'orders' ? 'bg-[#0f172a] text-blue-500 border border-[#334155]' : 'text-slate-400 hover:text-white hover:bg-[#0f172a]'}`}
                    >
                        <Package size={18} />
                        <span>Active Projects</span>
                    </button>

                    <button
                        onClick={() => { setActiveTab('new'); setWizardStep(1); }}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === 'new' ? 'bg-[#0f172a] text-blue-500 border border-[#334155]' : 'text-slate-400 hover:text-white hover:bg-[#0f172a]'}`}
                    >
                        <PlusCircle size={18} />
                        <span>Choose Plan</span>
                    </button>
                </div>

                <div className="p-4 border-t border-[#334155]">
                    <div className="flex items-center px-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold mr-3 shadow-md text-white">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <div className="text-sm font-bold text-white truncate">{user?.name}</div>
                            <div className="text-xs text-slate-400 font-medium truncate">{user?.email}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-[#0f172a] transition-colors"
                    >
                        <LogOut size={16} />
                        <span>Log out</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-[#334155] bg-[#1e293b]">
                    <span className="font-bold text-xl text-white">WebDev<span className="text-blue-500">Pro</span></span>
                    <div className="flex space-x-2 bg-[#0f172a] p-1 rounded-lg">
                        <button onClick={() => { setActiveTab('orders'); setWizardStep(1); }} className={`p-2 rounded-md ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><Package size={18} /></button>
                        <button onClick={() => { setActiveTab('new'); setWizardStep(1); }} className={`p-2 rounded-md ${activeTab === 'new' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><PlusCircle size={18} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative z-10 w-full max-w-5xl mx-auto">

                    {activeTab === 'orders' && (
                        <div>
                            <div className="mb-8">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Your Projects</h1>
                                <p className="mt-2 text-sm text-slate-400 font-medium">Track milestones and manage active development requests.</p>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="bg-[#1e293b] rounded-2xl p-12 text-center border border-[#334155] max-w-2xl mx-auto mt-10">
                                    <h3 className="text-xl font-bold text-white mb-2">No active projects</h3>
                                    <p className="text-slate-400 mb-8 font-medium max-w-xs mx-auto text-sm">You haven't requested any website development services yet.</p>
                                    <button
                                        onClick={() => { setActiveTab('new'); setWizardStep(1); }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold inline-flex items-center transition-colors"
                                    >
                                        <PlusCircle className="mr-2" size={18} />
                                        Choose Plan
                                    </button>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2">
                                    {orders.map((order) => (
                                        <div key={order._id} className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 transition-all flex flex-col h-full relative overflow-hidden">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <span className="text-xs font-bold text-blue-500 uppercase tracking-wider block mb-1.5">{order.plan} Plan</span>
                                                    <h3 className="text-lg font-extrabold text-white truncate w-40">{order.companyName || 'Personal Project'}</h3>
                                                </div>
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border z-10 ${getStatusBadge(order.status)}`}>
                                                    {statusIcon(order.status)}
                                                    {order.status}
                                                </span>
                                            </div>

                                            <div className="bg-[#0f172a] rounded-xl p-4 mb-6 flex-grow border border-[#334155]">
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div>
                                                        <span className="text-slate-500 block text-xs uppercase tracking-wider font-bold mb-1">Architecture</span>
                                                        <span className="font-bold text-slate-300">{order.pages} Pages</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-slate-500 block text-xs uppercase tracking-wider font-bold mb-1">Total Pricing</span>
                                                        <span className="font-bold text-slate-300">₹{order.budget.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center text-xs mt-auto pt-4 border-t border-[#334155]">
                                                <span className="text-slate-500 font-bold">Inv # {order._id.substring(order._id.length - 6).toUpperCase()}</span>
                                                <button
                                                    onClick={() => handleOpenChat(order)}
                                                    className="inline-flex items-center bg-[#0f172a] text-blue-500 font-bold px-4 py-2 rounded-lg transition-colors border border-[#334155] hover:border-blue-500/50"
                                                >
                                                    <MessageSquare size={14} className="mr-1.5" /> Project Chat
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* NEW PROJECT CREATION WORKFLOW */}
                    {activeTab === 'new' && (
                        <div className="max-w-3xl mx-auto">

                            {/* Wizard Progress Bar */}
                            <div className="mb-8">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-6">
                                    {wizardStep === 1 && 'Project Details Form'}
                                    {wizardStep === 2 && 'Order Summary'}
                                    {wizardStep === 3 && 'Secure Checkout'}
                                    {wizardStep === 4 && 'Request Received'}
                                </h1>

                                <div className="flex items-center space-x-2 text-sm font-bold">
                                    <span className={`${wizardStep >= 1 ? 'text-blue-500' : 'text-slate-500'}`}>1. Details</span>
                                    <ChevronRight size={14} className="text-slate-600" />
                                    <span className={`${wizardStep >= 2 ? 'text-blue-500' : 'text-slate-500'}`}>2. Summary</span>
                                    <ChevronRight size={14} className="text-slate-600" />
                                    <span className={`${wizardStep >= 3 ? 'text-blue-500' : 'text-slate-500'}`}>3. Payment</span>
                                    <ChevronRight size={14} className="text-slate-600" />
                                    <span className={`${wizardStep >= 4 ? 'text-emerald-500' : 'text-slate-500'}`}>4. Complete</span>
                                </div>
                            </div>

                            {/* WIZARD STEP 1: FORM */}
                            {wizardStep === 1 && (
                                <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-6 sm:p-10 relative overflow-hidden">
                                    <form onSubmit={handleNextStep} className="space-y-6">

                                        <div className="mb-4">
                                            <h3 className="text-lg font-extrabold text-white mb-2 border-b border-[#334155] pb-2">Client Identity</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
                                                <input type="text" disabled value={user.name} className="w-full bg-[#0f172a] border border-[#334155] text-slate-500 rounded-xl px-4 py-3 cursor-not-allowed font-medium" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
                                                <input type="email" disabled value={user.email} className="w-full bg-[#0f172a] border border-[#334155] text-slate-500 rounded-xl px-4 py-3 cursor-not-allowed font-medium" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-slate-300 mb-2">Phone Number <span className="text-rose-500">*</span></label>
                                                <div className="flex">
                                                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-[#334155] bg-[#0f172a] text-slate-400">
                                                        <Phone size={16} />
                                                    </span>
                                                    <input
                                                        type="tel"
                                                        required
                                                        className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-r-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-500 font-medium"
                                                        value={formData.phoneNumber}
                                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                        placeholder="+1 (555) 000-0000"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-8 mb-4">
                                            <h3 className="text-lg font-extrabold text-white mb-2 border-b border-[#334155] pb-2">Project Specifications</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-300 mb-2">Business Type / Industry</label>
                                                <input
                                                    type="text"
                                                    required placeholder="e.g. Retail, SaaS, Agency"
                                                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder-slate-500 font-medium"
                                                    value={formData.businessType}
                                                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-300 mb-2">Website Type</label>
                                                <select
                                                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                                                    value={formData.websiteType}
                                                    onChange={(e) => setFormData({ ...formData, websiteType: e.target.value })}
                                                    required
                                                >
                                                    <option value="">Select Structure</option>
                                                    <option value="Landing Page">Landing Page</option>
                                                    <option value="E-commerce">E-commerce Portal</option>
                                                    <option value="Corporate">Corporate Hub</option>
                                                    <option value="SaaS Platform">Full-Stack SaaS</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-300 mb-2">Select Architecture Plan</label>
                                                <select
                                                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                                                    value={formData.plan}
                                                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                                                >
                                                    <option value="basic">Basic (₹3,000)</option>
                                                    <option value="standard">Standard (₹7,000)</option>
                                                    <option value="premium">Premium (₹50,000+)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-300 mb-2">Number of Pages</label>
                                                <input
                                                    type="number"
                                                    required min="1"
                                                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                                                    value={formData.pages}
                                                    onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-bold text-slate-300 mb-2">Delivery Speed Selection</label>
                                                <select
                                                    className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-medium"
                                                    value={formData.deliveryOption}
                                                    onChange={(e) => setFormData({ ...formData, deliveryOption: e.target.value })}
                                                >
                                                    {Object.entries(deliveryPricing).map(([key, info]) => {
                                                        const pMultiplier = formData.plan === 'premium' ? 2.5 : 1;
                                                        const pAdd = info.price * pMultiplier;
                                                        return (
                                                            <option key={key} value={key}>
                                                                {info.label} {pAdd > 0 ? `(+ ₹${pAdd.toLocaleString()})` : ''}
                                                            </option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-8 mb-4">
                                            <h3 className="text-lg font-extrabold text-white mb-2 border-b border-[#334155] pb-2">Website Feature Selection</h3>
                                            <p className="text-sm text-slate-400 font-medium">Select functionality modules for correct project scoping.</p>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {websiteFeaturesList.map(feature => (
                                                <label key={feature} className="flex items-center bg-[#0f172a] p-3 rounded-lg border border-[#334155] cursor-pointer hover:border-blue-500 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded text-blue-600 bg-[#1e293b] border-[#334155] focus:ring-blue-500 focus:ring-offset-[#0f172a]"
                                                        checked={formData.features.includes(feature)}
                                                        onChange={() => handleFeatureToggle(feature)}
                                                    />
                                                    <span className="ml-2 text-sm font-medium text-slate-300">{feature}</span>
                                                </label>
                                            ))}
                                        </div>

                                        <div className="mt-6">
                                            <label className="block text-sm font-bold text-slate-300 mb-2">
                                                What is the website about? What business or project is it related to? <span className="text-rose-500">*</span>
                                            </label>
                                            <textarea
                                                required rows="4"
                                                className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none placeholder-slate-500 font-medium"
                                                placeholder="Provide detailed description of the business model and website goals..."
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            ></textarea>
                                        </div>

                                        <div className="mt-8 mb-4">
                                            <h3 className="text-lg font-extrabold text-white mb-2 border-b border-[#334155] pb-2">Optional Services</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {addonOptions.map(addon => (
                                                <label key={addon.id} className="flex items-start bg-[#0f172a] p-4 rounded-xl border border-[#334155] cursor-pointer hover:border-blue-500 transition-colors">
                                                    <div className="flex items-center h-5 mt-0.5">
                                                        <input
                                                            type="checkbox"
                                                            className="w-5 h-5 rounded text-blue-600 bg-[#1e293b] border-[#334155] focus:ring-blue-500"
                                                            checked={formData.addons.includes(addon.id)}
                                                            onChange={() => handleAddonToggle(addon.id)}
                                                        />
                                                    </div>
                                                    <div className="ml-3 flex-1 flex flex-col sm:flex-row sm:justify-between">
                                                        <div>
                                                            <span className="block text-sm font-extrabold text-white">{addon.name}</span>
                                                            <span className="block text-xs font-semibold text-slate-400 mt-0.5">{addon.desc}</span>
                                                        </div>
                                                        <div className="mt-2 sm:mt-0 font-extrabold text-blue-500 text-sm">
                                                            {addon.price > 0 ? `+ ₹${addon.price.toLocaleString()}` : 'Custom Pricing'}
                                                        </div>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>

                                        <div className="pt-6 mt-6 border-t border-[#334155]">
                                            <button
                                                type="submit"
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all text-lg flex justify-center items-center"
                                            >
                                                Continue to Summary <ChevronRight className="ml-2" />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* WIZARD STEP 2: SUMMARY */}
                            {wizardStep === 2 && (
                                <div className="space-y-6">
                                    <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-8 relative overflow-hidden">
                                        <div className="mb-6 flex justify-between items-end border-b border-[#334155] pb-4">
                                            <div>
                                                <h3 className="text-xl font-extrabold text-white mb-1">Order Summary</h3>
                                                <p className="text-sm text-slate-400 font-medium">Please review your project scope before secure payment.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-y-4 text-sm mb-6 pb-6 border-b border-[#334155]">
                                            <div><span className="text-slate-500 block text-xs uppercase font-bold mb-1">Client Name</span><span className="font-extrabold text-white">{user.name}</span></div>
                                            <div><span className="text-slate-500 block text-xs uppercase font-bold mb-1">Contact Phone</span><span className="font-extrabold text-white">{formData.phoneNumber}</span></div>
                                            <div><span className="text-slate-500 block text-xs uppercase font-bold mb-1">Industry</span><span className="font-extrabold text-white capitalize">{formData.businessType}</span></div>
                                            <div><span className="text-slate-500 block text-xs uppercase font-bold mb-1">Delivery</span><span className="font-extrabold text-white capitalize">{formData.deliveryOption}</span></div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="font-extrabold text-slate-300 capitalize">{formData.plan} Plan Core (Est. {formData.pages} Pages)</span>
                                                <span className="font-extrabold text-white">
                                                    ₹{formData.plan === 'standard' ? '7,000' : formData.plan === 'premium' ? '50,000' : '3,000'}
                                                </span>
                                            </div>

                                            {formData.deliveryOption !== 'normal' && (
                                                <div className="flex justify-between items-center text-sm pl-4 relative">
                                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                    <span className="text-slate-400 font-bold">{deliveryPricing[formData.deliveryOption].label}</span>
                                                    <span className="font-bold text-white">
                                                        + ₹{(deliveryPricing[formData.deliveryOption].price * (formData.plan === 'premium' ? 2.5 : 1)).toLocaleString()}
                                                    </span>
                                                </div>
                                            )}

                                            {formData.addons.length > 0 && formData.addons.map(addonId => {
                                                const a = addonOptions.find(opt => opt.id === addonId);
                                                return (
                                                    <div key={a.id} className="flex justify-between items-center text-sm pl-4 relative">
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                                                        <span className="text-slate-400 font-bold">{a.name}</span>
                                                        <span className="font-bold text-white">{a.price > 0 ? `+ ₹${a.price.toLocaleString()}` : 'TBD'}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-[#334155] flex justify-between items-end">
                                            <span className="text-slate-400 font-extrabold uppercase tracking-widest text-xs">Total Due Now</span>
                                            <span className="text-3xl font-extrabold text-blue-500 tracking-tight">₹{formData.budget.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {submitError && <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl text-sm border border-rose-500/20 mb-6 font-bold">{submitError}</div>}

                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => setWizardStep(1)}
                                            className="w-1/3 bg-[#0f172a] hover:bg-[#334155] text-slate-300 px-8 py-4 rounded-xl font-bold transition-colors text-base border border-[#334155]"
                                        >
                                            Edit Details
                                        </button>
                                        <button
                                            onClick={handleProceedToPayment}
                                            className="w-2/3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-colors text-base flex justify-center items-center"
                                        >
                                            Submit Project <CreditCard size={18} className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* WIZARD STEP 3: PAYMENT UI SIMULATION */}
                            {wizardStep === 3 && (
                                <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-12 text-center max-w-lg mx-auto">
                                    <CreditCard size={56} className="mx-auto text-blue-500 mb-6 animate-pulse" />
                                    <h3 className="text-2xl font-extrabold text-white mb-2">Secure Payment Gateway</h3>
                                    <p className="text-slate-400 font-medium mb-8 max-w-xs mx-auto text-sm">You are being charged ₹{formData.budget.toLocaleString()} instantly via secure network.</p>

                                    <button
                                        onClick={handleProcessPayment}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-colors text-base"
                                    >
                                        Complete Payment Validation
                                    </button>
                                </div>
                            )}

                            {/* WIZARD STEP 4: CONFIRMATION */}
                            {wizardStep === 4 && (
                                <div className="bg-[#1e293b] rounded-2xl border border-[#334155] p-12 text-center max-w-lg mx-auto">
                                    <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="text-emerald-500 h-10 w-10" />
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">Payment Successful</h3>
                                    <p className="text-slate-400 font-medium mb-8 text-base">Your project request has been received. Our team will contact you soon regarding the initial kickoff.</p>

                                    <button
                                        onClick={resetWizard}
                                        className="bg-[#0f172a] hover:bg-[#334155] border border-[#334155] text-white px-8 py-3.5 rounded-xl font-extrabold transition-colors"
                                    >
                                        View Order Dashboard
                                    </button>
                                </div>
                            )}

                        </div>
                    )}


                    {/* Chat UI */}
                    {activeTab === 'chat' && selectedOrder && (
                        <div className="bg-[#1e293b] rounded-3xl border border-[#334155] overflow-hidden flex flex-col md:flex-row h-[70vh] min-h-[500px]">

                            {/* Order Details Sidebar */}
                            <div className="w-full md:w-80 bg-[#0f172a] border-r border-[#334155] p-6 overflow-y-auto hidden md:block">
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-blue-500 mb-6 flex items-center transition-colors"
                                >
                                    &larr; Return Hub
                                </button>

                                <h3 className="text-lg font-extrabold text-white mb-6">Environment Specs</h3>
                                <div className="space-y-5">
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Build Status</p>
                                        <span className={`mt-1.5 inline-flex items-center px-2.5 py-1 rounded border text-xs font-bold ${getStatusBadge(selectedOrder.status)}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Instance Name</p>
                                        <p className="font-extrabold text-slate-300 mt-1">{selectedOrder.companyName || 'Personal Project'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Config Array</p>
                                        <p className="font-bold text-slate-300 mt-1 capitalize">{selectedOrder.plan} Tier</p>
                                        <p className="font-bold text-blue-500">Budget: ₹{selectedOrder.budget.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sys Log</p>
                                        <p className="text-xs text-slate-400 font-medium mt-1.5 leading-relaxed bg-[#1e293b] p-2.5 rounded border border-[#334155]">{selectedOrder.description}</p>
                                    </div>

                                    {selectedOrder.adminResponse && (
                                        <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 mt-6 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mb-1.5">Lead Engineer Msg</p>
                                            <p className="text-xs text-blue-200 italic font-medium leading-relaxed">{selectedOrder.adminResponse}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Chat Window */}
                            <div className="flex-1 flex flex-col h-full relative">
                                <div className="p-4 sm:p-5 border-b border-[#334155] flex items-center justify-between bg-[#1e293b] z-10 w-full">
                                    <div>
                                        <h3 className="font-bold text-white flex items-center text-sm md:text-base">
                                            <Code2 size={18} className="mr-2 text-blue-500" />
                                            Engineering Comm Link
                                        </h3>
                                    </div>
                                    {/* Mobile Back Button */}
                                    <button onClick={() => setActiveTab('orders')} className="md:hidden text-xs text-blue-500 font-extrabold uppercase tracking-wider">
                                        Close
                                    </button>
                                </div>

                                <div className="flex-grow p-4 sm:p-6 overflow-y-auto bg-[#0f172a] relative">

                                    <div className="relative z-10 w-full">
                                        {messages.length === 0 ? (
                                            <div className="h-full flex flex-col items-center justify-center text-slate-500 py-10">
                                                <MessageSquare size={32} className="mb-4 text-slate-600" />
                                                <p className="text-sm font-bold">Link established. Awaiting input.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {messages.map((msg, idx) => {
                                                    const isMe = msg.senderId._id === user._id;
                                                    return (
                                                        <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                            <div className="flex items-end max-w-[85%] sm:max-w-[75%] gap-2">
                                                                {!isMe && (
                                                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex-shrink-0 flex items-center justify-center text-[9px] font-extrabold text-blue-400">
                                                                        DEV
                                                                    </div>
                                                                )}
                                                                <div className={`px-4 py-3 rounded-2xl ${isMe ? 'bg-blue-600 text-white rounded-br-sm shadow-md' : 'bg-[#1e293b] text-slate-200 rounded-bl-sm border border-[#334155] font-medium'}`}>
                                                                    <p className="text-sm leading-relaxed">{msg.message}</p>
                                                                </div>
                                                            </div>
                                                            <span className="text-[10px] font-bold tracking-wider text-slate-500 mt-1.5 px-1">
                                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                                <div ref={messagesEndRef} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-4 bg-[#1e293b] border-t border-[#334155] relative z-10">
                                    <form onSubmit={handleSendMessage} className="flex relative items-center">
                                        <input
                                            type="text"
                                            required
                                            placeholder="Message development team..."
                                            className="w-full bg-[#0f172a] border border-[#334155] text-white rounded-xl pl-4 pr-14 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-sm font-medium placeholder-slate-500"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed shadow-sm"
                                        >
                                            <Send size={16} className="ml-0.5" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
