import React from 'react';

const KHQRPayment = ({
    paymentStatus,
    qrCodeDataURL,
    timeLeft,
    statusMessage,
    khqrData,
    calculatedTotal,
    isGeneratingQR,
    onRetry,
    onBack
}) => {
    const formatTimeLeft = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">KHQR Payment</h1>

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
                                <p className="text-gray-600 mb-4">Scan this QR code with your Bakong app</p>

                                {qrCodeDataURL && (
                                    <div className="flex justify-center mb-4">
                                        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                                            <img
                                                src={qrCodeDataURL}
                                                alt="KHQR Payment Code"
                                                className="w-64 h-64"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                                    <p className="text-lg font-bold text-blue-800">
                                        Total: ${calculatedTotal.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-blue-600">
                                        {khqrData?.currency || 'KHR'} • Bill #{khqrData?.billNumber}
                                    </p>
                                </div>

                                <div className="flex items-center justify-center mb-4">
                                    <div className="text-orange-600 mr-2">⏰</div>
                                    <span className="text-lg font-mono font-bold">
                                        {formatTimeLeft(timeLeft)}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mb-4">
                                    {statusMessage}
                                </p>
                            </div>

                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                                <span className="text-blue-600">Waiting for payment...</span>
                            </div>

                            {/* Payment Instructions */}
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
                                <h4 className="font-semibold text-gray-900 mb-2">How to pay:</h4>
                                <ol className="text-sm text-gray-600 space-y-1">
                                    <li>1. Open your Bakong or participating bank app</li>
                                    <li>2. Select "Scan QR" or "KHQR" option</li>
                                    <li>3. Point your camera at the QR code above</li>
                                    <li>4. Verify the payment amount</li>
                                    <li>5. Complete the transaction</li>
                                </ol>
                            </div>
                        </div>
                    )}

                    {paymentStatus === 'expired' && (
                        <div className="text-center">
                            <div className="text-orange-600 text-4xl mb-4">⏰</div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">QR Code Expired</h2>
                            <p className="text-gray-600 mb-6">{statusMessage}</p>
                            <button
                                onClick={onRetry}
                                disabled={isGeneratingQR}
                                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 disabled:bg-orange-400 transition-colors"
                            >
                                {isGeneratingQR ? 'Generating...' : 'Generate New QR'}
                            </button>
                        </div>
                    )}

                    {paymentStatus === 'paid' && (
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-green-800 mb-4">Payment Successful!</h2>
                            <p className="text-gray-600">{statusMessage}</p>
                        </div>
                    )}

                    {paymentStatus === 'failed' && (
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Failed</h2>
                            <p className="text-gray-600 mb-6">{statusMessage}</p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={onRetry}
                                    disabled={isGeneratingQR}
                                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-red-400 transition-colors"
                                >
                                    {isGeneratingQR ? 'Generating...' : 'Try Again'}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={onBack}
                            className="text-gray-600 hover:text-gray-800 underline transition-colors"
                        >
                            ← Back to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KHQRPayment;