const navLinksByRole = {
    user: [
      { path: "/", label: "Home" },
      { path: "/about-us", label: "About Us" },
      { path: "/join-us", label: "Join Us" },
      { path: "/cart", label: "My Cart" },
    ],
    pharmacist: [
      { path: "/", label: "Dashboard" },
      { path: "/inventory", label: "Inventory" },
      { path: "/pharmacy-profile/6775b215e9c18e99cf266f48", label: "My pharmacy" },
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