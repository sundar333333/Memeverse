import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaComment, FaShare } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLikeMeme } from '@/store/slices/memesSlice';
import { RootState } from '@/store';
import { Meme } from '@/store/slices/memesSlice';

interface MemeCardProps {
  meme: Meme;
  index?: number;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme, index = 0 }) => {
  const dispatch = useDispatch();
  const likedMemes = useSelector((state: RootState) => state.memes.likedMemes);
  const isLiked = likedMemes.includes(meme.id);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleLikeMeme(meme.id));
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: meme.name,
        url: `/meme/${meme.id}`,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`${window.location.origin}/meme/${meme.id}`)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(console.error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="card hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
    >
      <Link href={`/meme/${meme.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={meme.url}
            alt={meme.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 truncate">{meme.name}</h3>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLike}
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                {isLiked ? (
                  <FaHeart className="text-red-500" />
                ) : (
                  <FaRegHeart />
                )}
                <span>{meme.likes || 0}</span>
              </button>
              
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <FaComment />
                <span>{meme.comments?.length || 0}</span>
              </div>
            </div>
            
            <button 
              onClick={handleShare}
              className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <FaShare />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MemeCard;