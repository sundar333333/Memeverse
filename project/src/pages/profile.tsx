import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FaEdit, FaHeart, FaUpload, FaSignOutAlt } from 'react-icons/fa';
import { RootState } from '@/store';
import { updateProfile } from '@/store/slices/userSlice';
import MemeGrid from '@/components/ui/MemeGrid';
import Head from 'next/head';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.currentUser);
  const allMemes = useSelector((state: RootState) => state.memes.items);
  const likedMemeIds = useSelector((state: RootState) => state.memes.likedMemes);
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [activeTab, setActiveTab] = useState<'uploads' | 'likes'>('uploads');
  
  // Filter memes for the active tab
  const likedMemes = allMemes.filter(meme => likedMemeIds.includes(meme.id));
  // For demo purposes, let's assume the first 3 memes are uploaded by the user
  const uploadedMemes = allMemes.slice(0, 3);
  
  const displayedMemes = activeTab === 'uploads' ? uploadedMemes : likedMemes;
  
  const handleSaveProfile = () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    dispatch(updateProfile({
      name,
      bio
    }));
    
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };
  
  if (!user) {
    return (
      <div className="min-h-screen bg-primary-50 dark:bg-dark-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{user.name}'s Profile | MemeVerse</title>
        <meta name="description" content={`${user.name}'s profile on MemeVerse`} />
      </Head>

      <div className="bg-primary-50 dark:bg-dark-800 min-h-screen">
        <div className="container-custom mx-auto py-12">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-dark-700 rounded-xl shadow-md overflow-hidden mb-8"
          >
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-primary-400 to-secondary-500 relative">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute top-4 right-4 bg-white dark:bg-dark-800 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                >
                  <FaEdit className="text-primary-600 dark:text-primary-400" />
                </button>
              )}
            </div>
            
            <div className="px-6 py-8 md:px-8">
              <div className="flex flex-col md:flex-row md:items-end -mt-20 mb-6">
                {/* Profile Picture */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-dark-700 shadow-lg">
                  <Image
                    src={user.profilePicture}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* User Info */}
                <div className="mt-4 md:mt-0 md:ml-6 md:mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="text-2xl font-bold input mb-2"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-dark-800 dark:text-white">
                      {user.name}
                    </h1>
                  )}
                  <p className="text-gray-600 dark:text-gray-400">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {/* Bio */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-dark-800 dark:text-white">Bio</h2>
                {isEditing ? (
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="input w-full h-24"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
                )}
              </div>
              
              {/* Edit Profile Actions */}
              {isEditing && (
                <div className="flex space-x-4">
                  <button
                    onClick={handleSaveProfile}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Tabs */}
          <div className="mb-8">
            <div className="flex border-b border-gray-200 dark:border-dark-600">
              <button
                onClick={() => setActiveTab('uploads')}
                className={`py-3 px-6 font-medium text-lg ${
                  activeTab === 'uploads'
                    ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <FaUpload className="inline mr-2" />
                My Uploads
              </button>
              <button
                onClick={() => setActiveTab('likes')}
                className={`py-3 px-6 font-medium text-lg ${
                  activeTab === 'likes'
                    ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                <FaHeart className="inline mr-2" />
                Liked Memes
              </button>
            </div>
          </div>
          
          {/* Meme Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {displayedMemes.length > 0 ? (
              <MemeGrid memes={displayedMemes} />
            ) : (
              <div className="text-center py-12 bg-white dark:bg-dark-700 rounded-xl shadow-md">
                <div className="text-6xl mb-4">
                  {activeTab === 'uploads' ? '🖼️' : '❤️'}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {activeTab === 'uploads'
                    ? "You haven't uploaded any memes yet"
                    : "You haven't liked any memes yet"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {activeTab === 'uploads'
                    ? "Start sharing your humor with the world!"
                    : "Explore and like memes to see them here"}
                </p>
                <button className="btn btn-primary">
                  {activeTab === 'uploads' ? 'Upload a Meme' : 'Explore Memes'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;