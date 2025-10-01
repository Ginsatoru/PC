import React, { useState, useEffect } from 'react';

const KHQRPayment = ({
    paymentStatus,
    qrCodeDataURL,
    timeLeft,
    statusMessage,
    khqrData,
    calculatedTotal,
    isGeneratingQR,
    onRetry,
    onBack,
    orderId,
    onPaymentStatusChange
}) => {
    const [isChecking, setIsChecking] = useState(false);
    const [lastCheckTime, setLastCheckTime] = useState(null);
    const [checkCount, setCheckCount] = useState(0);

    const formatTimeLeft = (seconds) => {
        if (seconds <= 0) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Auto-check payment status periodically when pending
    useEffect(() => {
        let interval;
        
        if (paymentStatus === 'pending' && onPaymentStatusChange && !isChecking) {
            interval = setInterval(async () => {
                setIsChecking(true);
                try {
                    await onPaymentStatusChange();
                    setLastCheckTime(new Date());
                    setCheckCount(prev => prev + 1);
                } catch (error) {
                    console.error('Payment status check failed:', error);
                } finally {
                    setIsChecking(false);
                }
            }, 3000); // Check every 3 seconds
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [paymentStatus, onPaymentStatusChange, isChecking]);

    const getStatusColor = () => {
        switch (paymentStatus) {
            case 'paid': return 'text-green-600';
            case 'failed': return 'text-red-600';
            case 'expired': return 'text-orange-600';
            case 'pending': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusIcon = () => {
        switch (paymentStatus) {
            case 'paid':
                return (
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'failed':
                return (
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            case 'expired':
                return <div className="text-orange-600 text-4xl mb-4">⏰</div>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">KHQR Payment</h1>
                    <p className="text-gray-600">Pay with Bakong or any participating bank</p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    {paymentStatus === 'generating' && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <h2 className="text-xl font-bold mb-2">Generating QR Code</h2>
                            <p className="text-gray-600">Please wait while we prepare your payment...</p>
                        </div>
                    )}

                    {paymentStatus === 'pending' && (
                        <div className="text-center">
                            <div className="mb-6">
                                <h2 className="text-xl font-bold mb-2">Scan to Pay</h2>
                                <p className="text-gray-600 mb-4">Open your Bakong app and scan this QR code</p>

                                {qrCodeDataURL && (
                                    <div className="flex justify-center mb-6">
                                        <div className="bg-white p-6 rounded-xl border-2 border-gray-200 shadow-lg">
                                            <img
                                                src={qrCodeDataURL}
                                                alt="KHQR Payment Code"
                                                className="w-64 h-64 mx-auto"
                                            />
                                            <div className="mt-4 text-xs text-gray-500 text-center">
                                                KHQR Code • Order #{khqrData?.billNumber}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Details */}
                                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                                    <div className="text-2xl font-bold text-blue-800 mb-1">
                                        ${calculatedTotal?.toFixed(2) || '0.00'}
                                    </div>
                                    <div className="text-sm text-blue-600">
                                        {khqrData?.currency || 'USD'} • Bill #{khqrData?.billNumber}
                                    </div>
                                    {khqrData?.merchantName && (
                                        <div className="text-xs text-blue-500 mt-1">
                                            Pay to: {khqrData.merchantName}
                                        </div>
                                    )}
                                </div>

                                {/* Timer */}
                                <div className="flex items-center justify-center mb-4">
                                    <div className="text-orange-600 mr-2">⏰</div>
                                    <span className={`text-lg font-mono font-bold ${timeLeft <= 60 ? 'text-red-600' : 'text-gray-800'}`}>
                                        {formatTimeLeft(timeLeft)}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2">remaining</span>
                                </div>

                                {statusMessage && (
                                    <p className="text-sm text-gray-600 mb-4">
                                        {statusMessage}
                                    </p>
                                )}

                                {/* Status indicator */}
                                <div className="flex items-center justify-center mb-6">
                                    {isChecking ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                                            <span className="text-blue-600">Checking payment status...</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse mr-2"></div>
                                            <span className="text-orange-600">Waiting for payment...</span>
                                        </>
                                    )}
                                </div>

                                {/* Check status info */}
                                {lastCheckTime && (
                                    <div className="text-xs text-gray-400 mb-4">
                                        Last checked: {lastCheckTime.toLocaleTimeString()} • Checks: {checkCount}
                                    </div>
                                )}
                            </div>

                            {/* Payment Instructions */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    How to pay:
                                </h4>
                                <ol className="text-sm text-gray-600 space-y-2">
                                    <li className="flex items-start">
                                        <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">1</span>
                                        Open your Bakong or participating bank app
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">2</span>
                                        Select "Scan QR" or "KHQR" option
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">3</span>
                                        Point your camera at the QR code above
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">4</span>
                                        Verify the payment amount and merchant
                                    </li>
                                    <li className="flex items-start">
                                        <span className="inline-block w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5">5</span>
                                        Complete the transaction in your app
                                    </li>
                                </ol>

                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-xs text-yellow-800 flex items-start">
                                        <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        If you can't see payment options in your app, make sure your account is properly linked to KHQR services.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {paymentStatus === 'expired' && (
                        <div className="text-center">
                            {getStatusIcon()}
                            <h2 className="text-xl font-bold text-gray-800 mb-4">QR Code Expired</h2>
                            <p className="text-gray-600 mb-6">{statusMessage}</p>
                            <button
                                onClick={onRetry}
                                disabled={isGeneratingQR}
                                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:bg-orange-400 transition-colors inline-flex items-center"
                            >
                                {isGeneratingQR ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        Generate New QR
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {paymentStatus === 'paid' && (
                        <div className="text-center">
                            {getStatusIcon()}
                            <h2 className="text-xl font-bold text-green-800 mb-2">Payment Successful!</h2>
                            <p className="text-gray-600 mb-4">{statusMessage}</p>
                            
                            {khqrData?.transactionId && (
                                <div className="bg-green-50 p-3 rounded-lg mb-4">
                                    <p className="text-sm text-green-700">
                                        Transaction ID: <span className="font-mono">{khqrData.transactionId}</span>
                                    </p>
                                </div>
                            )}
                            
                            <div className="text-sm text-gray-500">
                                Your order will be processed shortly.
                            </div>
                        </div>
                    )}

                    {paymentStatus === 'failed' && (
                        <div className="text-center">
                            {getStatusIcon()}
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Failed</h2>
                            <p className="text-gray-600 mb-6">{statusMessage}</p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={onRetry}
                                    disabled={isGeneratingQR}
                                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors inline-flex items-center"
                                >
                                    {isGeneratingQR ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Try Again
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Error state for unsupported payment status */}
                    {!['generating', 'pending', 'expired', 'paid', 'failed'].includes(paymentStatus) && (
                        <div className="text-center">
                            <div className="text-gray-400 text-4xl mb-4">❓</div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Unknown Status</h2>
                            <p className="text-gray-600 mb-6">Payment status: {paymentStatus}</p>
                            <button
                                onClick={onRetry}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Retry Payment
                            </button>
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
                        <button
                            onClick={onBack}
                            className="text-gray-600 hover:text-gray-800 underline transition-colors inline-flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Checkout
                        </button>
                    </div>
                </div>

                {/* Additional support information */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>Having trouble? Contact our support team for assistance.</p>
                    {orderId && (
                        <p className="mt-1">Order Reference: <span className="font-mono">{orderId}</span></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default KHQRPayment;