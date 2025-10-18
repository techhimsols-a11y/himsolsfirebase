
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, Menu, X } from 'lucide-react';
import { useState } from 'react';
import WhatsAppWidget from '@/components/WhatsAppWidget';

interface LayoutProps {
  children: React.ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Tree Plantation', href: '/trees' },
    { name: 'Track Request', href: '/track-requests' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  useEffect(() => {
  const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
  if (match && match[1]) {
    setCurrentLang(match[1]);
  } else {
    setCurrentLang('en');
  }
}, []);
 
const setCookie = (name, value, days) => {
  const domain = window.location.hostname;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; domain=${domain}`;
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};
 
const deleteCookie = (name) => {
  const domain = window.location.hostname;
  // Delete cookie for current domain
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  // Also try deleting without domain specification
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  // Try deleting for parent domain as well
  const parentDomain = domain.split('.').slice(-2).join('.');
  if (parentDomain !== domain) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${parentDomain}`;
  }
};
 
const toggleLanguage = (newLang) => {
  if (newLang === 'en') {
    deleteCookie('googtrans');
    localStorage.removeItem('googtrans');
    sessionStorage.removeItem('googtrans');
  } else {
    const langPath = `/en/${newLang}`;
    setCookie('googtrans', langPath, 1);
  }
 
  setTimeout(() => {
    window.location.reload();
  }, );
};
 const [currentLang, setCurrentLang] = useState("select");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-earth-green/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-earth-green p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-earth-green">Himsols</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors hover:text-earth-green ${
                    isActive(item.href) ? 'text-earth-green' : 'text-gray-600'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Language Toggle Switch */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full p-1 relative">
              <div 
                className={`absolute top-1 bottom-1 w-20 bg-earth-green rounded-full transition-transform duration-300 ease-in-out ${
                  currentLang === 'hi' ? 'translate-x-20' : 'translate-x-0'
                }`}
              />
              <button
                onClick={() => toggleLanguage('en')}
                className={`relative z-10 px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-300 ${
                  currentLang === 'en' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                English
              </button>
              <button
                onClick={() => toggleLanguage('hi')}
                className={`relative z-10 px-3 py-1.5 text-sm font-medium rounded-full transition-colors duration-300 ${
                  currentLang === 'hi' ? 'text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                हिन्दी
              </button>
            </div>

            {/* Mobile Language Toggle */}
            <div className="md:hidden flex items-center bg-gray-100 rounded-full p-0.5 relative">
              <div 
                className={`absolute top-0.5 bottom-0.5 w-12 bg-earth-green rounded-full transition-transform duration-300 ease-in-out ${
                  currentLang === 'hi' ? 'translate-x-12' : 'translate-x-0'
                }`}
              />
              <button
                onClick={() => toggleLanguage('en')}
                className={`relative z-10 px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300 ${
                  currentLang === 'en' ? 'text-white' : 'text-gray-600'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => toggleLanguage('hi')}
                className={`relative z-10 px-2 py-1 text-xs font-medium rounded-full transition-colors duration-300 ${
                  currentLang === 'hi' ? 'text-white' : 'text-gray-600'
                }`}
              >
                हि
              </button>
            </div>
            {/* Auth Buttons & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="hidden md:block">
                <Button variant="outline" size="sm">
                  Cart
                </Button>
              </Link>
              <Link to="/auth" className="hidden md:block">
                <Button size="sm" className="bg-earth-green hover:bg-earth-green/90">
                  Login / Signup
                </Button>
              </Link>
              
              {/* Mobile menu button */}
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-600" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors hover:text-earth-green ${
                    isActive(item.href) ? 'text-earth-green' : 'text-gray-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 space-y-2">
                <Link to="/cart" className="block">
                  <Button variant="outline" size="sm" className="w-full">
                    Cart
                  </Button>
                </Link>
                <Link to="/auth" className="block">
                  <Button size="sm" className="w-full bg-earth-green hover:bg-earth-green/90">
                    Login / Signup
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-earth-brown text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-white p-2 rounded-lg">
                  <Leaf className="h-6 w-6 text-earth-green" />
                </div>
                <span className="text-xl font-bold">Himsols</span>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Leading the way in eco-sustainability through tree plantation, waste management, 
                and environmental conservation guidance.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><Link to="/trees" className="hover:text-white">Tree Plantation</Link></li>
                <li><Link to="/services" className="hover:text-white">Services</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Email: connect@himsols.com</li>
                <li>Phone: +91 8618982400</li>
                <li>Address: Shimla</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>&copy; 2024 Himsols. All rights reserved. Building a sustainable future together.</p>
          </div>
        </div>
      </footer>
      
      {/* WhatsApp Widget - Global */}
      <WhatsAppWidget 
        phoneNumber="+918618982400" 
        message="Hello! I'm interested in Himsols eco-friendly services. Can you help me?"
      />
    </div>
  );
};

export default Layout;
