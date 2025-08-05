import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import SideMenu from "./components/SideMenu";
import Home from "./pages/Home/Home";
import SearchResults from "./pages/searchResult/SearchResult";
import MedicineDetail from "./pages/medicineDetail/MedicineDetail";
import PharmacyDetail from "./pages/pharmacyDetail/PharmacyDetail";

import AddMedicine from "./pages/addMedicine/AddMedicine";

import AddMedicineToInventory from "./pages/addMedicineInventory/AddMedicineToInventory";
import UPdatePharmacyProfile from "./pages/UpdatePharmacy/UpdatePharmacyProfile";
import JoinAsPharmacy from "./pages/JoinAsPharmacy/JoinAsPharmacy";

import ApplicationList from "./pages/ApplicationList/ApplicationList";
import Pharmacies from "./pages/Pharmacies/Pharmacies";
import Medicines from "./pages/Medicines/Medicines";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SignupForm from "./pages/auth/SignUP/SignUp";
import SignInForm from "./pages/auth/SignIn/SignIn";

import { SearchProvider } from "./context/searchContext";
import { LocationProvider } from "./context/locationContext";
import ApprovePage from "./pages/approvePage/ApprovePage";
import SignUpPharmacistForm from "./pages/auth/SignUpPharmacist/SignUpPharmacist";
import ApplicationDetail from "./pages/applicationDetail/ApplicationDetail";
import Inventory from "./pages/inventory/Inventory";
import UpdateInventoryMedicine from "./pages/updateInventoryMedicine/UpdateInventoryMedicine";
import UpdateMedicine from "./pages/updateMedicine/UpdateMedicine";
import PharmacistsList from "./pages/pharmacistList/PharmacistsList";
import MyMedicines from "./pages/myMedicines/MyMedicines";
import Footer from "./components/Footer";

 

function App() {
  
  return (

    <LocationProvider>
      <SearchProvider>
      
      <Router>
      <ToastContainer
      autoClose={2000} 
      position="top-center"
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
        <Route index element={<Home />} />
        <Route path="/sign-up" element={<SignupForm/>} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/searchResults" element={<SearchResults />} />
        <Route path="/medicines/:id" element={<MedicineDetail />} />
        <Route path="/join-us" element={<JoinAsPharmacy />} />
        <Route path="/my-medicines" element={<MyMedicines />} />
       
       {/* admin */}
        <Route path="/add-medicine-admin" element={<AddMedicine />} />
        <Route path="/applications" element={<ApplicationList />} />
        <Route path="/applications/:id" element={<ApplicationDetail />} />
        <Route path="/pharmacies" element={<Pharmacies />} />
        <Route path="/medicines" element={<Medicines />} />
        <Route path="/medicines/:medicineId/update" element={<UpdateMedicine />} />
        <Route path="/approve" element={<ApprovePage />} />

        {/* pharmacist */}
        <Route path="/sign-up-pharmacist/:pharmacyId" element={<SignUpPharmacistForm/>} />
        <Route path="/add-medicine-to-inventory" element={<AddMedicineToInventory />} />
        <Route path="/pharmacy-profile/:id" element={<PharmacyDetail />} />
        <Route path="/pharmacy-profile/:id/update" element={<UPdatePharmacyProfile />} />
        <Route path="/:id/inventory" element={<Inventory />} />
        <Route path="/:pharmacyId/inventory/:inventoryId/update" element={<UpdateInventoryMedicine />} />
        <Route path="/update-pharmacy-profile" element={<UPdatePharmacyProfile />} />
        <Route path="/:pharmacyId/pharmacist" element={<PharmacistsList />} />

        {/* other routes*/}
      </Routes>
      </Router>
    </SearchProvider>
  </LocationProvider>

  );
}

export default App;
