import React from 'react'
import Logo from '../assets/Logo.svg'
import { NavLink } from "react-router-dom";
import navLinksByRole from "../constants/navLinks";
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useNavigate } from "react-router-dom";

const cookies = new Cookies()


function NavBar() {
  const navigate = useNavigate()
  const user = cookies.get("user")
  const defaultNavLinks = navLinksByRole["user"]
  const handleSignOut = () => {
    cookies.set("user",null) //logout
    navigate('/')
  }
  
  const userRole =user?.role
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
          {
            userRole === "pharmacist" || userRole === "admin" ?
          
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
            </ul>:
            <ul className="flex space-x-4">
            {defaultNavLinks?.map((link) => (
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
          }
        </nav>
        {user? 
        <Button onClick={handleSignOut}>Sign Out</Button> :
        <Button> <Link to={"/sign-in"}>Sign In</Link></Button> }
      </div>
    </header>
  );
}

export default NavBar;
