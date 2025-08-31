import React, { useState, useContext, useEffect, useRef } from "react";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import api from "../../utils/api";
import OrderSummary from "./OrderSummary";
import ShippingForm from "./ShippingForm";
import KHQRPayment from "./KHQRPayment";
import SuccessScreen from "./SuccessScreen";

const Checkout = () => {
    const { cartItems, clearCart, getCartTotal } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const pollIntervalRef = useRef(null);
    const timeoutRef = useRef(null);

    const [currentPage, setCurrentPage] = useState('checkout');
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
    const [shippingInfo, setShippingInfo] = useState({
        fullName: "",
        email: user?.email || "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "Cambodia",
    });

    // KHQR Payment States
    const [currentOrder, setCurrentOrder] = useState(null);
    const [khqrData, setKhqrData] = useState(null);
    const [qrCodeDataURL, setQrCodeDataURL] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [isGeneratingQR, setIsGeneratingQR] = useState(false);

    // Calculate prices
    const itemsPrice = getCartTotal();
    const taxPrice = itemsPrice * 0.1;
    const shippingPrice = 0;
    const calculatedTotal = itemsPrice + taxPrice + shippingPrice;

    // Cleanup intervals on unmount
    useEffect(() => {
        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const handleInputChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        const required = [
            "fullName",
            "email",
            "phone",
            "address",
            "city",
            "postalCode",
            "country",
        ];
        return required.every((field) => shippingInfo[field].trim() !== "");
    };

    const createOrder = async () => {
        const orderData = {
            orderItems: cartItems.map((item) => ({
                product: item._id,
                name: item.name,
                image: item.image || "/placeholder-image.jpg",
                price: item.price,
                quantity: item.quantity,
            })),
            shippingAddress: {
                name: shippingInfo.fullName,
                address: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.city,
                postalCode: shippingInfo.postalCode,
                country: shippingInfo.country,
                phone: shippingInfo.phone,
            },
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice: calculatedTotal,
        };

        const response = await api.post("/orders", orderData);
        return response.data;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            alert("Please fill in all required fields");
            return;
        }

        if (cartItems.length === 0) {
            alert("Your cart is empty");
            return;
        }

        setLoading(true);

        try {
            const order = await createOrder();
            setCurrentOrder(order);

            if (paymentMethod === 'KHQR') {
                await generateKHQR(order._id, calculatedTotal);
            } else {
                setOrderPlaced(true);
                clearCart();
                setTimeout(() => setCurrentPage('dashboard'), 3000);
            }
        } catch (error) {
            console.error("Order placement error:", error);
            alert(error.response?.data?.message || "Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    const generateKHQR = async (orderId, amount) => {
        setIsGeneratingQR(true);
        setPaymentStatus('generating');
        setStatusMessage('Generating KHQR code...');

        try {
            const response = await api.post(`/orders/${orderId}/khqr`, { amount });
            setKhqrData(response.data);
            await generateQRCode(response.data.qrString);

            const expiresAt = new Date(response.data.expiresAt);
            const now = new Date();
            const timeLeftSeconds = Math.floor((expiresAt - now) / 1000);
            setTimeLeft(Math.max(0, timeLeftSeconds));

            setPaymentStatus('pending');
            setStatusMessage('Scan the QR code with your Bakong app to complete payment');
            startPaymentPolling(orderId);

        } catch (error) {
            console.error('KHQR generation error:', error);
            setStatusMessage(error.response?.data?.message || 'Failed to generate KHQR');
            setPaymentStatus('failed');
        } finally {
            setIsGeneratingQR(false);
        }
    };

    const generateQRCode = async (qrString) => {
        try {
            const QRCode = await import('qrcode');
            const qrUrl = await QRCode.toDataURL(qrString, {
                width: 300,
                margin: 2,
                color: { dark: '#000000', light: '#FFFFFF' },
                errorCorrectionLevel: 'M'
            });
            setQrCodeDataURL(qrUrl);
        } catch (error) {
            console.error('Error generating QR code:', error);
            setStatusMessage('Failed to generate QR code image');
            throw error;
        }
    };

    const startPaymentPolling = (orderId) => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

        pollIntervalRef.current = setInterval(async () => {
            try {
                const response = await api.get(`/orders/${orderId}/khqr/status`);
                const { status, message } = response.data;

                setStatusMessage(message);

                if (status === 'paid') {
                    setPaymentStatus('paid');
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;

                    setTimeout(() => {
                        setOrderPlaced(true);
                        clearCart();
                        setTimeout(() => setCurrentPage('dashboard'), 3000);
                    }, 1500);
                } else if (status === 'failed' || status === 'expired') {
                    setPaymentStatus(status);
                    if (status === 'expired') setTimeLeft(0);
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                }
            } catch (error) {
                console.error('Payment status check error:', error);
            }
        }, 3000);
    };

    const retryKHQR = async () => {
        if (currentOrder) {
            await generateKHQR(currentOrder._id, calculatedTotal);
        }
    };

    const handleBackToCheckout = () => {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setPaymentStatus('idle');
        setCurrentOrder(null);
        setKhqrData(null);
        setQrCodeDataURL('');
        setStatusMessage('');
        setTimeLeft(0);
    };

    // Success or empty cart states
    if (orderPlaced || cartItems.length === 0) {
        return (
            <SuccessScreen
                orderPlaced={orderPlaced}
                cartItems={cartItems}
                paymentMethod={paymentMethod}
                setCurrentPage={setCurrentPage}
            />
        );
    }

    // KHQR Payment flow
    if (paymentMethod === 'KHQR' && paymentStatus !== 'idle') {
        return (
            <KHQRPayment
                paymentStatus={paymentStatus}
                qrCodeDataURL={qrCodeDataURL}
                timeLeft={timeLeft}
                statusMessage={statusMessage}
                khqrData={khqrData}
                calculatedTotal={calculatedTotal}
                isGeneratingQR={isGeneratingQR}
                onRetry={retryKHQR}
                onBack={handleBackToCheckout}
            />
        );
    }

    // Main checkout form
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <OrderSummary
                        cartItems={cartItems}
                        itemsPrice={itemsPrice}
                        taxPrice={taxPrice}
                        shippingPrice={shippingPrice}
                        calculatedTotal={calculatedTotal}
                    />

                    <ShippingForm
                        shippingInfo={shippingInfo}
                        paymentMethod={paymentMethod}
                        loading={loading}
                        isGeneratingQR={isGeneratingQR}
                        calculatedTotal={calculatedTotal}
                        onInputChange={handleInputChange}
                        onPaymentMethodChange={setPaymentMethod}
                        onBackToCart={() => setCurrentPage('cart')}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
};

export default Checkout;