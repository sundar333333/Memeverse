import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { FaUpload, FaImage } from 'react-icons/fa';
import { addUserMeme } from '@/store/slices/memesSlice';
import { toast } from 'react-hot-toast';
import Head from 'next/head';
import { v4 as uuidv4 } from 'uuid';

const UploadPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [memeName, setMemeName] = useState('');
  const [memeCategory, setMemeCategory] = useState('random');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    maxSize: 5242880, // 5MB
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !memeName) {
      toast.error('Please provide a meme name and image');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // In a real app, you would upload the file to a server
      // For this demo, we'll simulate a successful upload
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new meme object
      const newMeme = {
        id: uuidv4(),
        name: memeName,
        url: previewImage as string,
        width: 500,
        height: 500,
        box_count: 2,
        category: memeCategory,
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString(),
        uploadedBy: 'user_id'
      };
      
      // Add the meme to the store
      dispatch(addUserMeme(newMeme));
      
      toast.success('Meme uploaded successfully!');
      router.push('/');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload meme. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Upload Meme | MemeVerse</title>
        <meta name="description" content="Upload your own memes to MemeVerse" />
      </Head>

      <div className="bg-primary-50 dark:bg-dark-800 min-h-screen py-12">
        <div className="container-custom mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-8 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 text-transparent bg-clip-text">
              Upload Your Meme
            </h1>
          </motion.div>

          <div className="bg-white dark:bg-dark-700 rounded-xl shadow-md p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="memeName" className="block text-dark-800 dark:text-white font-medium mb-2">
                  Meme Title
                </label>
                <input
                  type="text"
                  id="memeName"
                  value={memeName}
                  onChange={(e) => setMemeName(e.target.value)}
                  placeholder="Give your meme a catchy title"
                  className="input"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="memeCategory" className="block text-dark-800 dark:text-white font-medium mb-2">
                  Category
                </label>
                <select
                  id="memeCategory"
                  value={memeCategory}
                  onChange={(e) => setMemeCategory(e.target.value)}
                  className="input"
                >
                  <option value="trending">Trending</option>
                  <option value="new">New</option>
                  <option value="classic">Classic</option>
                  <option value="random">Random</option>
                </select>
              </div>

              <div className="mb-8">
                <label className="block text-dark-800 dark:text-white font-medium mb-2">
                  Upload Image
                </label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-primary-500 bg-primary-100 dark:bg-primary-900/20'
                      : 'border-gray-300 dark:border-dark-600 hover:border-primary-500 dark:hover:border-primary-500'
                  }`}
                >
                  <input {...getInputProps()} />
                  
                  {previewImage ? (
                    <div className="space-y-4">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Click or drag to replace
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FaImage className="text-5xl mx-auto text-gray-400 dark:text-gray-600" />
                      <div>
                        <p className="text-lg font-medium">
                          Drag and drop your image here
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          or click to select a file
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Supports: JPG, PNG, GIF (Max 5MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary flex items-center space-x-2"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <FaUpload />
                      <span>Upload Meme</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPage;