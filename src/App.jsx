import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";
import Home from "./pages/Home";
import { useState } from "react";
import SearchResults from "./pages/searchResult/SearchResult";
import MedicineDetail from "./pages/medicineDetail/MedicineDetail";
import "leaflet/dist/leaflet.css";
import PharmacyDetail from "./pages/pharmacyDetail/PharmacyDetail";

function App() {
  const [role, setRole] = useState("user");

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
        <Route path="/searchResults" element={<SearchResults />} />
        <Route path="/medicineDetail/:id" element={<MedicineDetail />} />
        <Route path="/pharmacyDetail/:id" element={<PharmacyDetail />} />
        {/* other routes*/}
      </Routes>
    </Router>
  );
}

export default App;
