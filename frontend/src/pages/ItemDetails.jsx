// pages/ItemDetails.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/apiClient'; // Ensure this path is correct
import ItemDetail from '../components/ItemDetail'; // The UI component

export default function ItemDetailsPage() {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        // API call to fetch single item details
        api.get(`/api/dashboard/items/${itemId}`)
            .then(res => {
                setItem(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error loading item details:", err);
                setIsLoading(false);
                // Optionally navigate to a 404 or show an error message
            });
    }, [itemId]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Loading Item Details...</div>;
    }

    if (!item) {
        return <div className="min-h-screen flex items-center justify-center text-xl text-red-600">Item not found.</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-lg text-blue-700 hover:text-blue-900 transition duration-150 mb-6 font-semibold"
            >
                &larr; Back to Item List
            </button>
            
            {/* Pass the fetched item data to the dedicated UI component */}
            <ItemDetail item={item} />
        </div>
    );
}