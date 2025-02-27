import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import MemeGrid from './MemeGrid';
import { Meme } from '@/store/slices/memesSlice';

interface TrendingSectionProps {
  memes: Meme[];
  loading?: boolean;
}

const TrendingSection: React.FC<TrendingSectionProps> = ({ memes, loading = false }) => {
  return (
    <section className="py-16 bg-white dark:bg-dark-800">
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold font-display mb-4 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 text-transparent bg-clip-text">
            Trending Memes
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            Check out the hottest memes that are making waves across the internet right now.
          </p>
        </motion.div>

        <MemeGrid memes={memes} loading={loading} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link href="/explore" className="btn btn-primary">
            Explore More Memes
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TrendingSection;