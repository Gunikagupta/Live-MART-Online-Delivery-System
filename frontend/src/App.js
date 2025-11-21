import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./CartContext";

// Import all your components/pages
import Login from "./components/Login";
import Register from "./components/Register";
import CategoryGrid from "./components/CategoryGrid";
import ItemList from "./components/ItemList";
import NearbyShops from "./pages/NearbyShops";
import ItemDetails from "./pages/ItemDetails";
import CartContents from "./pages/CartContents";
import NearbyShopsMap from "./pages/NearbyShopsMap";
import OrdersPage from "./pages/OrdersPage";
import OrderDetails from "./pages/OrderDetails";
import CheckoutWrapper from "./pages/CheckoutWrapper";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/categories" element={<CategoryGrid />} />
          <Route path="/dashboard" element={<CategoryGrid />} />
          <Route path="/category/:categoryId" element={<ItemList />} />
          <Route path="/shops/nearby" element={<NearbyShops />} />
          <Route path="/item/:itemId" element={<ItemDetails />} />
          <Route path="/cart" element={<CartContents />} />
          <Route path="/shops/map" element={<NearbyShopsMap />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/checkout" element={<CheckoutWrapper />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Add other page routes as needed */}
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
