import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4"> <span className="text-red-600">BONGO</span><span className="text-blue-600">Shoes</span></h3>
            <p className="text-gray-400 mb-4">
              Your premium destination for quality footwear. We believe every step should be comfortable and stylish.
            </p>
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Youtube size={20} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/products?category=man" className="hover:text-white transition-colors">Man</Link></li>
              <li><Link to="/products?category=child" className="hover:text-white transition-colors">Child</Link></li>
              <li><Link to="/products?category=women" className="hover:text-white transition-colors">Women</Link></li>
              {/* <li><Link to="/products?sale=true" className="hover:text-white transition-colors">Sale</Link></li> */}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
              {/* <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li> */}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-3">
                <Phone size={16} />
                <span>+88 01813 848018</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} />
                <span>contact.bongoshoes@gmail.com</span>
              </div>
              {/* <div className="flex items-center space-x-3">
                <MapPin size={16} />
                <span>123 Fashion St, NY 10001</span>
              </div> */}
            </div>

           
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 Bongo shoes. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
