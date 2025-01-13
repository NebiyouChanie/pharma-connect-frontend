import React, { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router-dom";
import Logo from "../assets/Logo.svg";
import navLinksByRole from "../constants/navLinks";
import { CircleX, Menu } from "lucide-react";
import Cookies from "universal-cookie";
import { Button } from "./ui/button";

const cookies = new Cookies();

function SideMenu() {
  const user = cookies.get("user");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const defaultNavLinks = navLinksByRole["user"];

  // Handle Sign Out
  const handleSignOut = () => {
    cookies.set("user", null); // Logout
    localStorage.setItem("authToken", "");
    toggleMenu()
    navigate("/");
  };

  const userRole = user?.role;

  // Determine the links for the user role
  const links =
    typeof navLinksByRole[userRole] === "function"
      ? navLinksByRole[userRole](user?.pharmacyId)
      : navLinksByRole[userRole] || defaultNavLinks;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Hamburger Icon */}
      <div className="md:hidden bg-lightbg p-4 flex justify-between items-center shadow-md z-10">
        <img src={Logo} alt="pharma connect logo" className="h-8" />
        <button onClick={toggleMenu}>
          {isOpen ? (
            <CircleX size={24} color="#286AA7" />
          ) : (
            <Menu size={24} color="#286AA7" />
          )}
        </button>
      </div>

      {/* Side Menu */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0 z-30" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 flex justify-between items-center mb-3">
          <img src={Logo} alt="pharma connect logo" className="h-6" />
          <button onClick={toggleMenu}>
            <CircleX size={24} color="#286AA7" />
          </button>
        </div>
        <nav className="mt-4 text-primary">
          <ul className="space-y-4 px-4">
            {links?.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link?.path}
                  className={({ isActive }) =>
                    isActive
                      ? "px-4 py-2 text-black shadow-md border-b-2 rounded-none border-black transition-transform transform scale-105 ease-in-out block"
                      : "px-4 py-2 text-black font-medium hover:border-b-2 hover:border-black hover:text-black hover:rounded-none transition-all ease-in-out block"
                  }
                  onClick={toggleMenu}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4">
          {user ? (
            <Button variant="outline" onClick={handleSignOut} className="h-fit">
              Sign Out
            </Button>
          ) : (
            <Link to="/sign-in">
              <Button variant="outline" onClick={toggleMenu} className="h-fit">Sign In</Button>
            </Link>
          )}
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleMenu}
        ></div>
      )}
    </div>
  );
}

export default SideMenu;
