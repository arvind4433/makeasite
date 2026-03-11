import { createContext, useState, useContext, useCallback } from 'react';

/**
 * OrderContext
 * 
 * Manages:
 *  - pendingPlan: the plan the user clicked before login (null | 'basic' | 'standard' | 'premium' | 'custom')
 *  - orderModalOpen: whether the order form modal is open
 *  - cartOpen: whether the cart drawer is open
 *  - cartItems: orders fetched from the server (refreshed after creation)
 */
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const [pendingPlan, setPendingPlan] = useState(null);
    const [orderModalOpen, setOrderModalOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [cartBadge, setCartBadge] = useState(0);

    const openOrderModal = useCallback((plan) => {
        setPendingPlan(plan);
        setOrderModalOpen(true);
    }, []);

    const closeOrderModal = useCallback(() => {
        setOrderModalOpen(false);
        // Don't clear pendingPlan immediately — clear after modal animation
        setTimeout(() => setPendingPlan(null), 300);
    }, []);

    const openCart = useCallback(() => setCartOpen(true), []);
    const closeCart = useCallback(() => setCartOpen(false), []);

    const addCartItem = useCallback((order) => {
        setCartItems(prev => [order, ...prev]);
        setCartBadge(prev => prev + 1);
    }, []);

    const removeCartItem = useCallback((orderId) => {
        setCartItems(prev => prev.filter(o => o._id !== orderId));
        setCartBadge(prev => Math.max(0, prev - 1));
    }, []);

    const setCartItemsFromServer = useCallback((orders) => {
        setCartItems(orders);
        setCartBadge(orders.length);
    }, []);

    return (
        <OrderContext.Provider value={{
            pendingPlan,
            setPendingPlan,
            orderModalOpen,
            openOrderModal,
            closeOrderModal,
            cartOpen,
            openCart,
            closeCart,
            cartItems,
            cartBadge,
            addCartItem,
            removeCartItem,
            setCartItemsFromServer,
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrder = () => useContext(OrderContext);
