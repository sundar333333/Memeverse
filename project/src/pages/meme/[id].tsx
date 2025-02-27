import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart, FaShare, FaDownload, FaComment } from 'react-icons/fa';
import { fetchMemeById, toggleLikeMeme, addComment, Meme, Comment } from '@/store/slices/memesSlice';
import { RootState, AppDispatch } from '@/store';
import Head from 'next/head';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

const MemeDetailPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  
  const meme = useSelector((state: RootState) => state.memes.currentMeme);
  const likedMemes = useSelector((state: RootState) => state.memes.likedMemes);
  const user = useSelector((state: RootState) => state.user.currentUser);
  
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id && typeof id === 'string') {
      setLoading(true);
      dispatch(fetchMemeById(id))
        .finally(() => setLoading(false));
    }
  }, [dispatch, id]);
  
  useEffect(() => {
    if (meme && likedMemes.includes(meme.id)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  }, [meme, likedMemes]);
  
  const handleLike = () => {
    if (meme) {
      dispatch(toggleLikeMeme(meme.id));
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: meme?.name || 'Check out this meme',
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          toast.success('Link copied to clipboard!');
        })
        .catch(console.error);
    }
  };
  
  const handleDownload = () => {
    if (meme) {
      const link = document.createElement('a');
      link.href = meme.url;
      link.download = `${meme.name.replace(/\s+/g, '-').toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    if (meme && user) {
      const newComment: Comment = {
        id: uuidv4(),
        text: commentText,
        user: user.name,
        createdAt: new Date().toISOString()
      };
      
      dispatch(addComment({
        memeId: meme.id,
        comment: newComment
      }));
      
      setCommentText('');
      toast.success('Comment added!');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-primary-50 dark:bg-dark-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!meme) {
    return (
      <div className="min-h-screen bg-primary-50 dark:bg-dark-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Meme not found</h2>
          <button 
            onClick={() => router.push('/explore')}
            className="btn btn-primary"
          >
            Explore Memes
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{meme.name} | MemeVerse</title>
        <meta name="description" content={`View and share the "${meme.name}" meme on MemeVerse`} />
      </Head>

      <div className="bg-primary-50 dark:bg-dark-800 min-h-screen py-12">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Meme Image */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md overflow-hidden">
                <div className="relative aspect-square w-full max-h-[600px]">
                  <Image
                    src={meme.url}
                    alt={meme.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw"
                  />
                </div>
                
                <div className="p-4 border-t border-gray-200 dark:border-dark-600">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
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
                      
                      <button 
                        onClick={handleShare}
                        className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <FaShare />
                        <span>Share</span>
                      </button>
                      
                      <button 
                        onClick={handleDownload}
                        className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        <FaDownload />
                        <span>Download</span>
                      </button>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {meme.category && (
                        <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-2 py-1 rounded-full text-xs">
                          {meme.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Meme Info and Comments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold mb-2 text-dark-800 dark:text-white">
                  {meme.name}
                </h1>
                
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {meme.createdAt && (
                    <p>Uploaded on {new Date(meme.createdAt).toLocaleDateString()}</p>
                  )}
                </div>
                
                <div className="border-t border-gray-200 dark:border-dark-600 pt-4">
                  <h2 className="text-lg font-semibold mb-4 flex items-center text-dark-800 dark:text-white">
                    <FaComment className="mr-2" />
                    Comments ({meme.comments?.length || 0})
                  </h2>
                  
                  {/* Comment Form */}
                  <form onSubmit={handleSubmitComment} className="mb-6">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="input flex-grow"
                      />
                      <button 
                        type="submit"
                        className="btn btn-primary"
                      >
                        Post
                      </button>
                    </div>
                  </form>
                  
                  {/* Comments List */}
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {meme.comments && meme.comments.length > 0 ? (
                      meme.comments.map((comment) => (
                        <div 
                          key={comment.id}
                          className="bg-gray-50 dark:bg-dark-600 p-3 rounded-lg"
                        >
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-dark-800 dark:text-white">
                              {comment.user}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">
                            {comment.text}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                        No comments yet. Be the first to comment!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MemeDetailPage;