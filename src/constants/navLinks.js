const navLinksByRole = {
    user: [
      { path: "/", label: "Home" },
      { path: "/about-us", label: "About Us" },
      { path: "/join-us", label: "Join Us" },
      { path: "/cart", label: "My Cart" },
    ],
    pharmacist: (pharmacyId) => [
      { path: "/", label: "Dashboard" },
      { path: `/inventory/${pharmacyId}`, label: "Inventory" },
      { path: `/pharmacy-profile/${pharmacyId}`, label: "My Pharmacy" },  // Add pharmacyId dynamically
      { path: "/add-medicine-to-inventory", label: "Add Medicine" },
    ],
    admin: [
      { path: "/", label: "Admin Dashboard" },
      { path: "/manage-pharmacies", label: "Pharmacies" },
      { path: "/reports", label: "Medicines" },
      { path: "/manage-pharmacies", label: "Applications" },
    ],
    owner: [
        { path: "/", label: "Dashboard" },
        { path: "/inventory", label: "Manage Inventory" },
        { path: "/profile", label: "Profile" },
        { path: "/profile", label: "My pharmacy" },
        { path: "/settings", label: "Employees" },
    ],
  };
  

  export default navLinksByRole