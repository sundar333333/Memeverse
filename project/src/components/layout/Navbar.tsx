import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { FaSun, FaMoon, FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.currentUser);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Upload', path: '/upload' },
    { name: 'Leaderboard', path: '/leaderboard' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-dark-800/90 backdrop-blur-md shadow-md' 
          : 'bg-primary-50 dark:bg-dark-800'
      }`}
    >
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="text-3xl font-bold text-primary-600 dark:text-primary-500"
            >
              🤣
            </motion.div>
            <span className="text-2xl font-bold font-display bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 text-transparent bg-clip-text">
              MemeVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`font-medium transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400 ${
                  router.pathname === link.path 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-dark-600 dark:text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <FaSun className="text-primary-400 text-xl" />
              ) : (
                <FaMoon className="text-primary-600 text-xl" />
              )}
            </button>

            {/* User profile */}
            <Link 
              href="/profile" 
              className="hidden md:flex items-center space-x-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
            >
              {user?.profilePicture ? (
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image 
                    src={user.profilePicture} 
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <FaUser className="text-dark-600 dark:text-gray-300" />
              )}
            </Link>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <FaTimes className="text-dark-600 dark:text-gray-300 text-xl" />
              ) : (
                <FaBars className="text-dark-600 dark:text-gray-300 text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-white dark:bg-dark-800 shadow-lg"
        >
          <div className="container-custom mx-auto py-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  className={`font-medium transition-colors duration-200 hover:text-primary-600 dark:hover:text-primary-400 ${
                    router.pathname === link.path 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-dark-600 dark:text-gray-300'
                  }`}
                  onClick={closeMenu}
                >
                  {link.name}
                </Link>
              ))}
              <Link 
                href="/profile"
                className="font-medium text-dark-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                onClick={closeMenu}
              >
                Profile
              </Link>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;