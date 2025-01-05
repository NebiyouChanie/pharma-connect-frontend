const navLinksByRole = {
  user: [
    { path: "/", label: "Home" },
    { path: "/searchResults", label: "Search" },
    { path: "/about-us", label: "About Us" },
    { path: "/join-us", label: "Join Us" },
    { path: "/my-medicines", label: "My Medicines" },
  ],
  pharmacist: (pharmacyId) => [
    { path: "/", label: "Dashboard" },
    { path: "/searchResults", label: "Search" },
    { path: `/${pharmacyId}/inventory`, label: "Inventory" },
    { path: `/pharmacy-profile/${pharmacyId}`, label: "My Pharmacy" },
    { path: "/add-medicine-to-inventory", label: "Add Medicine" },
  ],
  admin: [
    { path: "/", label: "Admin Dashboard" },
    { path: "/pharmacies", label: "Pharmacies" },
    { path: "/medicines", label: "Medicines" },
    { path: "/add-medicine-admin", label: "Add Medicine" },
    { path: "/applications", label: "Applications" },
  ],
  owner: (pharmacyId) => [
    { path: "/", label: "Dashboard" },
    { path: "/searchResults", label: "Search" },
    { path: `/${pharmacyId}/inventory`, label: "Inventory" },
    { path: `/pharmacy-profile/${pharmacyId}`, label: "My Pharmacy" },
    { path: `/${pharmacyId}/pharmacist`, label: "Pharmacists" },
    { path: "/add-medicine-to-inventory", label: "Add Medicine" },
  ],
};

export default navLinksByRole;
