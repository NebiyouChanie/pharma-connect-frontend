import React from 'react'
import Logo from '../assets/Logo.svg'
import { NavLink } from "react-router-dom";
import navLinksByRole from "../constants/navLinks";
import { useRoleContext } from "@/context/roleContext";

function NavBar() {
    const { role } = useRoleContext();
  const links = navLinksByRole[role];

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
