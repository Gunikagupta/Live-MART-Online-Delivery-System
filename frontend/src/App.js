import React from "react";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Pages & Components
import CartPage from "./pages/CartPage";
import Register from "./components/Register";
import Login from "./components/Login";
import CategoryGrid from "./components/CategoryGrid";
import ItemList from "./components/ItemList";
import ItemDetail from "./components/ItemDetail";
import OrdersPage from "./pages/OrdersPage";
import OrderDetails from "./pages/OrderDetails";
import Checkout from "./pages/Checkout";
import ProfilePage from "./pages/ProfilePage";
import RetailerProxyItems from "./pages/RetailerProxyItems";
import SearchItemsWithFilters from "./pages/SearchItemsWithFilters";
import NearbyShops from "./pages/NearbyShops";
import NearbyShopsMap from "./pages/NearbyShopsMap";
import PlaceOrderForm from "./components/PlaceOrderForm";
import OrderHistory from "./components/OrderHistory";
import FeedbackPage from "./pages/FeedbackPage"; // Import your FeedbackPage

// ⭐ YOUR PAYPAL CLIENT ID ⭐
const PAYPAL_CLIENT_ID = "AUXHndhp9RD1py5GqyfuXCpXlv33V4Q5V65DoVsePrnyCddU1rBs6H-SNMLPItTYjXB0NH3tkf-cUEna";

// Wrapper component to pass itemId param to FeedbackPage
function FeedbackPageWrapper() {
  const { itemId } = useParams();
  return <FeedbackPage itemId={itemId} />;
}

function App() {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": PAYPAL_CLIENT_ID,
        currency: "USD",
      }}
    >
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
          <Route path="/checkout" element={<Checkout />} />

          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Retailer Proxy */}
          <Route path="/retailer/:retailerId/proxy-items" element={<RetailerProxyItems />} />

          {/* Search */}
          <Route path="/search" element={<SearchItemsWithFilters />} />

          {/* Nearby Shops */}
          <Route path="/shops/nearby" element={<NearbyShops />} />
          <Route path="/shops/map" element={<NearbyShopsMap />} />

          {/* Optional extras */}
          <Route path="/orders/create" element={<PlaceOrderForm />} />
          <Route path="/orders/history" element={<OrderHistory />} />

          {/* Feedback Page with itemId param */}
          <Route path="/feedback/:itemId" element={<FeedbackPageWrapper />} />
        </Routes>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
