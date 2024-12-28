import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";
import Home from "./pages/Home";
import { useState } from "react";
import MedicineList from "./pages/medicineList/MedicineList";
import PharmacyDetail from "./pages/pharmacyDetail/PharmacyDetail";

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
        
        <Route path="/pharmacylist" element={<PharmacyDetail />} />
        
        <Route path="/medicineList" element={<MedicineList />} />
      
        {/* other routes*/}
      </Routes>
    </Router>
  );
}

export default App;
