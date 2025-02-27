import React from 'react';
import MemeCard from './MemeCard';
import { Meme } from '@/store/slices/memesSlice';
import { motion } from 'framer-motion';

interface MemeGridProps {
  memes: Meme[];
  loading?: boolean;
}

const MemeGrid: React.FC<MemeGridProps> = ({ memes, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="bg-gray-300 dark:bg-dark-600 aspect-square w-full"></div>
            <div className="p-4">
              <div className="h-6 bg-gray-300 dark:bg-dark-600 rounded w-3/4 mb-4"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded w-1/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (memes.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4">😢</div>
        <h3 className="text-xl font-semibold mb-2">No memes found</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your filters or search terms
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {memes.map((meme, index) => (
        <MemeCard key={meme.id} meme={meme} index={index} />
      ))}
    </div>
  );
};

export default MemeGrid;