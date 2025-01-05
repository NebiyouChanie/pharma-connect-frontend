import React from 'react';
import Logo from '../assets/Logo.svg';
import { NavLink } from 'react-router-dom';
import navLinksByRole from '../constants/navLinks';
import Cookies from 'universal-cookie';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const cookies = new Cookies();

function NavBar() {
  const navigate = useNavigate();
const cookies = new Cookies();
  const user = cookies.get('user');
  const defaultNavLinks = navLinksByRole['user'];

  const handleSignOut = () => {
    cookies.set('user', null); // Logout
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
                      ? 'text-white bg-primary rounded-2xl px-4 py-[6px] font-medium text-[18px] transition-all ease-in-out'
                      : 'hover:text-white hover:bg-primary hover:rounded-2xl px-4 py-[6px] font-medium text-[18px] transition-all ease-in-out'
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
          <Button>
            <Link to="/sign-in">Sign In</Link>
          </Button>
        )}
      </div>
    </header>
  );
}

export default NavBar;
