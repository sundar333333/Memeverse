import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaAward, FaArrowUp } from 'react-icons/fa';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Meme } from '@/store/slices/memesSlice';

interface LeaderboardUser {
  id: string;
  name: string;
  profilePicture: string;
  points: number;
  rank: number;
  memesCount: number;
}

const LeaderboardPage: React.FC = () => {
  const memes = useSelector((state: RootState) => state.memes.items);
  const [topMemes, setTopMemes] = useState<Meme[]>([]);
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate top memes based on likes
    if (memes.length > 0) {
      const sortedMemes = [...memes]
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 10)
        .map(meme => ({
          ...meme,
          likes: meme.likes || Math.floor(Math.random() * 1000) + 100 // Ensure all memes have likes
        }));
      
      setTopMemes(sortedMemes);
      
      // Generate mock top users
      const mockUsers: LeaderboardUser[] = [
        {
          id: '1',
          name: 'MemeKing',
          profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
          points: 12500,
          rank: 1,
          memesCount: 45
        },
        {
          id: '2',
          name: 'LaughFactory',
          profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
          points: 10200,
          rank: 2,
          memesCount: 38
        },
        {
          id: '3',
          name: 'MemeQueen',
          profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
          points: 9800,
          rank: 3,
          memesCount: 32
        },
        {
          id: '4',
          name: 'JokeMaster',
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
          points: 8500,
          rank: 4,
          memesCount: 29
        },
        {
          id: '5',
          name: 'FunnyBones',
          profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
          points: 7200,
          rank: 5,
          memesCount: 25
        },
        {
          id: '6',
          name: 'MemeGuru',
          profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
          points: 6800,
          rank: 6,
          memesCount: 22
        },
        {
          id: '7',
          name: 'HumorHub',
          profilePicture: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
          points: 5900,
          rank: 7,
          memesCount: 19
        },
        {
          id: '8',
          name: 'LaughCrafter',
          profilePicture: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
          points: 5200,
          rank: 8,
          memesCount: 17
        },
        {
          id: '9',
          name: 'GiggleGenius',
          profilePicture: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
          points: 4800,
          rank: 9,
          memesCount: 15
        },
        {
          id: '10',
          name: 'MemeMaster',
          profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
          points: 4200,
          rank: 10,
          memesCount: 14
        }
      ];
      
      setTopUsers(mockUsers);
      setLoading(false);
    }
  }, [memes]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <FaTrophy className="text-yellow-500" size={24} />;
      case 2:
        return <FaMedal className="text-gray-400" size={24} />;
      case 3:
        return <FaMedal className="text-amber-700" size={24} />;
      default:
        return <FaAward className="text-primary-500" size={20} />;
    }
  };

  return (
    <>
      <Head>
        <title>Leaderboard | MemeVerse</title>
        <meta name="description" content="Check out the top memes and users on MemeVerse" />
      </Head>

      <div className="bg-primary-50 dark:bg-dark-800 min-h-screen py-12">
        <div className="container-custom mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-8 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 text-transparent bg-clip-text">
              Leaderboard
            </h1>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-8 bg-gray-300 dark:bg-dark-600 rounded w-1/3 mb-6"></div>
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-dark-600"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-300 dark:bg-dark-600 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded w-1/6"></div>
                    </div>
                    <div className="h-6 bg-gray-300 dark:bg-dark-600 rounded w-16"></div>
                  </div>
                ))}
              </div>
              <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 animate-pulse">
                <div className="h-8 bg-gray-300 dark:bg-dark-600 rounded w-1/3 mb-6"></div>
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 rounded bg-gray-300 dark:bg-dark-600"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-300 dark:bg-dark-600 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-300 dark:bg-dark-600 rounded w-1/5"></div>
                    </div>
                    <div className="h-6 bg-gray-300 dark:bg-dark-600 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Users */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6"
              >
                <h2 className="text-2xl font-bold mb-6 text-dark-800 dark:text-white">
                  Top Contributors
                </h2>
                
                <div className="space-y-6">
                  {topUsers.map((user) => (
                    <div key={user.id} className="flex items-center">
                      <div className="flex items-center justify-center w-10">
                        {getRankIcon(user.rank)}
                      </div>
                      
                      <div className="ml-4 flex items-center flex-1">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={user.profilePicture}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="ml-4">
                          <h3 className="font-semibold text-dark-800 dark:text-white">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {user.memesCount} memes
                          </p>
                        </div>
                      </div>
                      
                      <div className="font-bold text-lg text-primary-600 dark:text-primary-400">
                        {user.points.toLocaleString()} pts
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
              
              {/* Top Memes */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6"
              >
                <h2 className="text-2xl font-bold mb-6 text-dark-800 dark:text-white">
                  Top Memes
                </h2>
                
                <div className="space-y-6">
                  {topMemes.slice(0, 10).map((meme, index) => (
                    <Link 
                      href={`/meme/${meme.id}`} 
                      key={meme.id}
                      className="flex items-center hover:bg-gray-100 dark:hover:bg-dark-600 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center justify-center w-10">
                        {getRankIcon(index + 1)}
                      </div>
                      
                      <div className="ml-4 flex items-center flex-1">
                        <div className="relative w-16 h-16 rounded overflow-hidden">
                          <Image
                            src={meme.url}
                            alt={meme.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="ml-4">
                          <h3 className="font-semibold text-dark-800 dark:text-white truncate max-w-xs">
                            {meme.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(meme.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-red-500 font-semibold">
                        <FaArrowUp className="mr-1" />
                        {meme.likes}
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LeaderboardPage;