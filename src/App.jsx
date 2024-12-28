import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";
import Home from "./pages/Home";
import { useState } from "react";
import AddMedicine from "./pages/addMedicine/AddMedicine";

function App() {
  const [role, setRole] = useState('user');

  return (
    <Router>
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar role={role} />
      </div>

      {/* Mobile Side Menu */}
      <div className="md:hidden">
        <SideMenu role={role} />
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-medicine-admin" element={<AddMedicine />} />
        {/* other routes*/}
      </Routes>
    </Router>
  );
}

export default App;
