import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import LocationMap from "./components/LocationMap";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

      </Routes>
      <div>
    <h1>Live MART Location</h1>
    <LocationMap />
    </div>
    </Router>
    
  );
}

export default App;
