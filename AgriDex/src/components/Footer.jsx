import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-gray-400 text-center py-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm">
        <p>© {new Date().getFullYear()} AgriCarbonDex. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="#" className="hover:text-emerald-400 transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="hover:text-emerald-400 transition-colors duration-300">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;