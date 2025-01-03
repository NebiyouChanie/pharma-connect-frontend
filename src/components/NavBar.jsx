import React from 'react'
import Logo from '../assets/Logo.svg'
import { NavLink } from "react-router-dom";
import navLinksByRole from "../constants/navLinks";
import Cookies from 'universal-cookie';

const cookies = new Cookies()

function NavBar() {
  // const { user } = useUserContext();  // Access user data from context
  const user = cookies.get("user")

  // Get the links based on the user's role, including pharmacyId for pharmacists
  const links = user?.role === "pharmacist" 
    ? navLinksByRole.pharmacist(user?.pharmacyId)  // Pass pharmacyId for pharmacists
    : navLinksByRole[user?.role] || [];  // Default to other roles if no pharmacyId

  return (

    <header className='bg-lightbg py-6 shadow-md'>
      <div className='container flex justify-between items-center'>
        <div>
          <img src={Logo} alt="pharma connect logo" className='h-6 md:h-8 lg:h-10' />
        </div>
        <nav className="text-primary">
          <ul className="flex space-x-4">
            {links?.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-white bg-primary rounded-2xl px-4 py-[6px] font-medium text-[18px] transition-all ease-in-out"
                      : "hover:text-white hover:bg-primary hover:rounded-2xl px-4 py-[6px] font-medium text-[18px] transition-all ease-in-out"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default NavBar;
