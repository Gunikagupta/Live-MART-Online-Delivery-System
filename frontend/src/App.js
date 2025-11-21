import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CartPage from "./pages/CartPage";

// Authentication
import Register from "./components/Register";
import Login from "./components/Login";

// Categories + Items
import CategoryGrid from "./components/CategoryGrid";
import ItemList from "./components/ItemList";
import ItemDetail from "./components/ItemDetail";

// Orders + Checkout
import OrdersPage from "./pages/OrdersPage";
import OrderDetails from "./pages/OrderDetails";
import CheckoutWrapper from "./pages/CheckoutWrapper";
import ProfilePage from "./pages/ProfilePage";



// Retailer + Search
import RetailerProxyItems from "./pages/RetailerProxyItems";
import SearchItemsWithFilters from "./pages/SearchItemsWithFilters";

// Nearby Shops
import NearbyShops from "./pages/NearbyShops";
import NearbyShopsMap from "./pages/NearbyShopsMap";

// Legacy Order Pages (optional)
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

        {/* Dashboard / Categories */}
        <Route path="/dashboard" element={<CategoryGrid />} />
        <Route path="/category/:categoryId" element={<ItemList />} />
        <Route path="/item/:itemId" element={<ItemDetail />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Orders */}
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
        
        {/* Checkout */}
        <Route path="/checkout" element={<CheckoutWrapper />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* Retailer Proxy Items */}
        <Route
          path="/retailer/:retailerId/proxy-items"
          element={<RetailerProxyItems />}
        />

        {/* Search */}
        <Route path="/search" element={<SearchItemsWithFilters />} />

        {/* Nearby Shops */}
        <Route path="/shops/nearby" element={<NearbyShops />} />
        <Route path="/shops/map" element={<NearbyShopsMap />} />

        {/* Optional order pages */}
        <Route path="/orders/create" element={<PlaceOrderForm />} />
        <Route path="/orders/history" element={<OrderHistory />} />

      </Routes>
    </Router>
  );
}

export default App;
