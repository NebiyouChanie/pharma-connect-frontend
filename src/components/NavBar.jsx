import React from 'react';
import Logo from '../assets/Logo.svg';
import { NavLink } from 'react-router-dom';
import navLinksByRole from '../constants/navLinks';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';


function NavBar() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const user = cookies.get('user');
  const defaultNavLinks = navLinksByRole['user'];

  const handleSignOut = () => {
    cookies.set('user', null); // Logout
    localStorage.setItem("authToken", "");
    navigate('/');
  };

  const userRole = user?.role;

  // Determine the links for the user role
  const links =
    typeof navLinksByRole[userRole] === 'function'
      ? navLinksByRole[userRole](user?.pharmacyId) // Call function for roles like pharmacist/owner
      : navLinksByRole[userRole] || defaultNavLinks; // Use static array or default

  return (
    <header className="bg-lightbg py-6 shadow-md">
      <div className="container flex justify-between items-center">
        <div>
          <img src={Logo} alt="pharma connect logo" className="h-6 md:h-8 lg:h-10" />
        </div>
        <nav className="text-primary">
          <ul className="flex space-x-4">
            {links?.map((link) => (
              <li key={link.path}>
                <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      isActive
                      ? 'px-4 py-2 text-black   shadow-md border-b-2 rounded-none border-black transition-transform transform scale-105 ease-in-out'
                      : 'px-4 py-2 text-black font-medium hover:border-b-2 hover:border-black hover:text-black hover:rounded-none transition-all ease-in-out'

                    }
                  >
                    {link.label}
                  </NavLink>

              </li>
            ))}
          </ul>
        </nav>
        {user ? (
          <Button onClick={handleSignOut}>Sign Out</Button>
        ) : (
            <Link to="/sign-in">
              <Button>
              Sign In
              </Button>
            </Link>
        )}
      </div>
    </header>
  );
}

export default NavBar;
