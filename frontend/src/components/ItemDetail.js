import React from 'react';

// Assumes 'item' is passed as a prop from ItemDetailsPage.jsx
export default function ItemDetail({ item }) { 
    
    // --- 🔑 CRITICAL FIX: Add a null/undefined check for the 'item' object ---
    if (!item) {
        // Render nothing or a loading spinner if the item hasn't loaded yet
        return <div className="text-center py-10 text-lg text-gray-600">Loading item details...</div>;
    }
    // --------------------------------------------------------------------------

    // Now it's safe to access properties like item.stock, item.name, etc.
    const isInStock = item.stock > 0; // The line that was crashing before
    const stockStatusText = isInStock ? `In Stock (${item.stock} available)` : 'Out of Stock';

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-10">
                
                {/* Image Section */}
                <div className="lg:w-1/2">
                    <img
                        src={item.imageUrl || 'https://via.placeholder.com/600'}
                        alt={item.name}
                        className="w-full h-auto object-cover rounded-2xl shadow-lg border border-gray-100"
                    />
                </div>

                {/* Details Section */}
                <div className="lg:w-1/2 flex flex-col justify-between">
                    <div>
                        {/* Tags / Status Indicators */}
                        <div className="flex items-center space-x-3 mb-4">
                            <span
                                className={`px-4 py-1 text-sm font-bold uppercase rounded-full ${
                                    isInStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}
                            >
                                {stockStatusText}
                            </span>
                            {item.isProxyAvailable && (
                                <span className="px-4 py-1 text-sm font-bold uppercase rounded-full bg-indigo-100 text-indigo-800">
                                    Retailer Proxy Available
                                </span>
                            )}
                        </div>

                        {/* Item Name */}
                        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
                            {item.name}
                        </h1>

                        {/* Price */}
                        <p className="text-4xl font-extrabold text-indigo-600 mb-8">
                            ₹{item.price.toFixed(2)}
                        </p>
                        
                        {/* Availability Date */}
                        {item.available_date && (
                            <div className="border-t border-b border-gray-200 py-4 mb-8">
                                <p className="text-lg font-medium text-gray-700">
                                    Expected Availability Date: 
                                    <span className="ml-2 font-bold text-gray-900">
                                        {item.available_date}
                                    </span>
                                </p>
                            </div>
                        )}
                        
                        <p className="text-gray-600 mb-8">
                            High-quality product details...
                        </p>
                    </div>

                    {/* Action Button */}
                    <button
                        disabled={!isInStock}
                        className={`w-full py-4 rounded-xl text-xl font-bold text-white transition duration-300 shadow-lg 
                            ${
                                isInStock 
                                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                                    : 'bg-gray-400 cursor-not-allowed'
                            }
                        `}
                    >
                        {isInStock ? 'Add to Cart' : 'Notify Me When Available'}
                    </button>
                </div>
            </div>
        </div>
    );
}