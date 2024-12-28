import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";
import Home from "./pages/Home";
import { useState } from "react";

import AddMedicine from "./pages/addMedicine/AddMedicine";
import MedicineList from "./pages/medicineList/MedicineList";
import PharmacyDetail from "./pages/pharmacyDetail/PharmacyDetail";
import ApplicationList from "./pages/ApplicationList/ApplicationList";
import Pharmacies from "./pages/Pharmacies/Pharmacies";
import Medicines from "./pages/Medicines/Medicines";


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

        <Route path="/pharmacylist" element={<PharmacyDetail />} />
        
        <Route path="/medicineList" element={<MedicineList />} />

        <Route path="/applicationList" element={<ApplicationList />} />
        <Route path="/pharmacies" element={<Pharmacies />} />
        <Route path="/medicines" element={<Medicines />} />

        

        
      
        {/* other routes*/}
      </Routes>
    </Router>
  );
}

export default App;
