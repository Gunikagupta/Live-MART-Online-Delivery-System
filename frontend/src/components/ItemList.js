import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";

export default function ItemList() {
  const { categoryId } = useParams();
  
  const [items, setItems] = useState([]); 
  const [categoryName, setCategoryName] = useState("Loading..."); 
  const [isLoading, setIsLoading] = useState(true); 
  
  const navigate = useNavigate();

  // --- 1. Fetch Items for the Category ---
  useEffect(() => {
    setIsLoading(true);
    // Fetch items
    api.get(`/api/dashboard/categories/${categoryId}/items`)
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.error("Error loading items:", err);
        setItems([]);
      });
      
    // Fetch Category Name
    api.get(`/api/dashboard/categories/${categoryId}`) 
      .then((res) => {
        setCategoryName(res.data.name || "Items"); 
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading category name:", err);
        setCategoryName("Items");
        setIsLoading(false);
      });
  }, [categoryId]);


  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-indigo-600">Loading {categoryName}...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-lg text-blue-700 hover:text-blue-900 transition duration-150 mb-6 font-semibold"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Categories
      </button>

      {/* DYNAMIC TITLE */}
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">
        {categoryName}
      </h1>

      {items.length === 0 ? (
        // Enhanced Empty State UI
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white rounded-xl shadow-lg p-10">
          <svg className="w-20 h-20 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <p className="text-xl font-medium text-gray-600">No items available in the {categoryName} category.</p>
          <p className="text-gray-500 mt-2">Try selecting a different category or check back later.</p>
        </div>
      ) : (
        /* Items Grid - APPLIED ENHANCED UI */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {items.map((item) => {
            const isInStock = item.stock > 0;
            return (
              <div
                key={item.id}
                onClick={() => navigate(`/item/${item.id}`)} 
                className="
                  bg-white 
                  shadow-xl 
                  rounded-xl 
                  p-5 
                  hover:shadow-2xl 
                  transition duration-300 
                  cursor-pointer 
                  flex flex-col 
                  hover:border-indigo-400 border border-transparent"
              >
                {/* Image */}
                <img
                  src={item.imageUrl || "https://via.placeholder.com/200"}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                
                {/* Title */}
                <h2 className="mt-1 text-xl font-bold text-gray-800 truncate">
                  {item.name}
                </h2>
                
                {/* Price */}
                <p className="text-3xl text-indigo-600 font-extrabold mt-1 mb-2">
                  ₹{item.price}
                </p>

                {/* Statuses */}
                <div className="flex flex-col space-y-1 mb-3">
                    {/* Stock Status Badge */}
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider w-fit ${
                        isInStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {isInStock ? `In Stock (${item.stock})` : "Out of Stock"}
                    </span>

                    {/* Availability Date (Assumed field: item.available_date) */}
                    {item.available_date && (
                        <p className="text-xs text-gray-500 mt-1">
                            Avail: <span className="font-medium">{item.available_date}</span>
                        </p>
                    )}
                    
                    {/* Retailer Proxy Indicator (Assumed field: item.isProxyAvailable) */}
                    {item.isProxyAvailable && (
                        <p className="text-xs text-purple-700 font-medium">
                            Retailer Proxy Source
                        </p>
                    )}
                </div>

                {/* Button */}
                <button 
                    onClick={(e) => { e.stopPropagation(); navigate(`/item/${item.id}`); }}
                    className={`mt-auto w-full py-3 rounded-lg text-white font-semibold transition duration-200 shadow-md ${isInStock ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}
                >
                    {isInStock ? "View Details" : "Unavailable"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}