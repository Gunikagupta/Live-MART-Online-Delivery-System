import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Authentication
import Register from "./components/Register";
import Login from "./components/Login";

// Categories + Items
import CategoryGrid from "./components/CategoryGrid";
import ItemList from "./components/ItemList";
import ItemDetail from "./components/ItemDetail";

// Retailer + Search
import RetailerProxyItems from "./pages/RetailerProxyItems";
import SearchItemsWithFilters from "./pages/SearchItemsWithFilters";

// Nearby Shops (NEW)
import NearbyShops from "./pages/NearbyShops";
import NearbyShopsMap from "./pages/NearbyShopsMap";

import PlaceOrderForm from "./components/PlaceOrderForm";
import OrderHistory from "./components/OrderHistory";

function App() {
  return (
    <Router>
      <Routes>

        {/* Home → Login */}
        <Route path="/" element={<Login />} />

        {/* Auth */}
        <Route path="/register" element={<Register />} />

        {/* Categories + Items */}
        <Route path="/dashboard" element={<CategoryGrid />} />
        <Route path="/category/:categoryId" element={<ItemList />} />
        <Route path="/item/:itemId" element={<ItemDetail />} />

        {/* Retailer Proxy Items */}
        <Route
          path="/retailer/:retailerId/proxy-items"
          element={<RetailerProxyItems />}
        />

        {/* Search with filters */}
        <Route path="/search" element={<SearchItemsWithFilters />} />

        {/* Nearby Shops */}
        <Route path="/shops/nearby" element={<NearbyShops />} />
        <Route path="/shops/map" element={<NearbyShopsMap />} />

        <Route path="/orders/create" element={<PlaceOrderForm />} />
        <Route path="/orders/history" element={<OrderHistory />} />

      </Routes>
    </Router>
  );
}

export default App;
