import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-primary-100 to-primary-200 dark:from-dark-900 dark:to-dark-800 py-16 md:py-24">
      <div className="container-custom mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <motion.div 
            className="md:w-1/2 mb-10 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 text-transparent bg-clip-text">
              Welcome to MemeVerse
            </h1>
            <p className="text-lg md:text-xl text-dark-700 dark:text-gray-300 mb-8">
              Your ultimate destination for exploring, creating, and sharing the internet's funniest memes. Join our community of meme enthusiasts today!
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/explore" className="btn btn-primary text-center">
                Explore Memes
              </Link>
              <Link href="/upload" className="btn btn-outline text-center">
                Upload Your Own
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2 flex justify-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md">
              {/* Floating meme images */}
              <motion.div 
                className="absolute top-0 left-0 w-40 h-40 bg-white dark:bg-dark-700 rounded-lg shadow-lg overflow-hidden z-10 transform -rotate-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <div className="w-full h-full flex items-center justify-center bg-primary-300 dark:bg-primary-800 text-4xl">
                  🤣
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute top-20 right-0 w-48 h-48 bg-white dark:bg-dark-700 rounded-lg shadow-lg overflow-hidden z-20 transform rotate-12"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="w-full h-full flex items-center justify-center bg-secondary-300 dark:bg-secondary-800 text-5xl">
                  😎
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute bottom-0 left-20 w-56 h-56 bg-white dark:bg-dark-700 rounded-lg shadow-lg overflow-hidden z-30"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              >
                <div className="w-full h-full flex items-center justify-center bg-primary-200 dark:bg-primary-900 text-6xl">
                  🚀
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;