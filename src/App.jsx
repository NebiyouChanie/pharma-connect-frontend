import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import SideMenu from "./components/SideMenu";
import Home from "./pages/Home";
import { useState } from "react";
import SearchResults from "./pages/searchResult/SearchResult";
import MedicineDetail from "./pages/medicineDetail/MedicineDetail";
import PharmacyDetail from "./pages/pharmacyDetail/PharmacyDetail";

import AddMedicine from "./pages/addMedicine/AddMedicine";
import MedicineList from "./pages/medicineList/MedicineList";

import AddMedicineToInventory from "./pages/addMedicineInventory/addMedicineToInventory";
import UPdatePharmacyProfile from "./pages/UpdatePharmacy/UpdatePharmacyProfile";
import JoinAsPharmacy from "./pages/JoinAsPharmacy/JoinAsPharmacy";

import ApplicationList from "./pages/ApplicationList/ApplicationList";
import Pharmacies from "./pages/Pharmacies/Pharmacies";
import Medicines from "./pages/Medicines/Medicines";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignupForm from "./pages/auth/SignUP/SignUp";
import SignInForm from "./pages/auth/SignIn/SignIn";
import  {SearchProvider}  from "./context/searchContext"
import SignUpPharmacistForm from "./pages/auth/SignUpPharmacist/SignUpPharmacist";
import {RoleProvider } from "@/context/roleContext";




function App() {
  
  return (
    <RoleProvider>

    <SearchProvider>
    <Router>
      <ToastContainer
      // position="center"
      // autoClose={5000} // Automatically closes after 5 seconds
      // hideProgressBar={false} // Shows the progress bar
      // newestOnTop={false} // Toasts appear at the bottom
      // closeOnClick={true} // Closes the toast when clicked
      // rtl={false} // Set to true for right-to-left languages
      // draggable
      // pauseOnHover={true} // Pauses the toast when hovered
      />
      {/* Desktop Navbar */}
      <div className="hidden md:block">
        <Navbar/>
      </div>

      {/* Mobile Side Menu */}
      <div className="md:hidden">
        <SideMenu />
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignupForm/>} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/searchResults" element={<SearchResults />} />
        <Route path="/medicineDetail/:id" element={<MedicineDetail />} />
        <Route path="/join-us" element={<JoinAsPharmacy />} />
        <Route path="/add-medicine-admin" element={<AddMedicine />} />

        {/* pharmacist */}
        <Route path="/sign-up-pharmacist" element={<SignUpPharmacistForm/>} />
        <Route path="/add-medicine-to-inventory" element={<AddMedicineToInventory />} />
        <Route path="/pharmacy-profile/:id" element={<PharmacyDetail />} />
        <Route path="/inventory" element={<MedicineList />} />

        {/* other routes*/}
      </Routes>
    </Router>
  </SearchProvider>
</RoleProvider>
  );
}

export default App;
