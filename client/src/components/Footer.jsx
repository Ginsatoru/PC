import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">PC</span>
              </div>
              <span className="text-xl font-bold">PartShop</span>
            </div>
            <p className="text-gray-300">
              Your one-stop destination for premium PC parts and components. 
              Building better computers, one part at a time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-primary-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/category/GPU" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Graphics Cards
                </Link>
              </li>
              <li>
                <Link to="/category/CPU" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Processors
                </Link>
              </li>
              <li>
                <Link to="/category/RAM" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Memory
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/Motherboard" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Motherboards
                </Link>
              </li>
              <li>
                <Link to="/category/SSD" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Storage
                </Link>
              </li>
              <li>
                <Link to="/category/PSU" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Power Supplies
                </Link>
              </li>
              <li>
                <Link to="/category/Case" className="text-gray-300 hover:text-primary-400 transition-colors">
                  PC Cases
                </Link>
              </li>
              <li>
                <Link to="/category/Cooling" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Cooling
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <FiMapPin className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300">123 Tech Street, Digital City, TC 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <span className="text-gray-300">support@pcpartshop.com</span>
              </li>
            </ul>
            <div className="pt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Business Hours</h4>
              <p className="text-sm text-gray-400">
                Mon - Fri: 9:00 AM - 6:00 PM<br />
                Sat: 10:00 AM - 4:00 PM<br />
                Sun: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} PC PartShop. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Return Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;