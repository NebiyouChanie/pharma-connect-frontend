import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#1e3d5c] py-8 mt-32">
      <div className="container  mx-auto lg:px-64">
        <div className="flex flex-col md:flex-row md-gap-32 items-center md:items-start">
          {/* Logo and Description */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0 text-gray-400">
            <h2 className="text-xl font-bold mb-2 text-gray-300">Pharmac Connect</h2>
            <p className="text-sm">
              Your reliable partner in connecting pharmacies, healthcare professionals, and patients with essential resources.
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full md:w-1/3 md:text-center mb-6 md:mb-0 text-gray-400">
            <h3 className="text-lg font-semibold mb-3 text-gray-300">Quick Links</h3>
            <ul>
              <li>
                <a href="/about" className="hover:underline">About Us</a>
              </li>
              <li>
                <a href="/services" className="hover:underline">Services</a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">Contact</a>
              </li>
              <li>
                <a href="/faq" className="hover:underline">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="w-full md:w-1/3  text-gray-400">
            <h3 className="text-lg font-semibold mb-3 text-gray-300">Contact Us</h3>
            <p className="text-sm">
              <span >Email:</span> support@pharmacconnect.com
            </p>
            <p className="text-sm">
              <span >Phone:</span> +251-123-456-789
            </p>
            <p className="text-sm">
              <span >Address:</span> Addis Ababa, Ethiopia
            </p>
          </div>
        </div>


        {/* Copyright */}
        <div className="mt-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Pharmac Connect. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
