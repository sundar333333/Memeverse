import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import debounce from 'lodash.debounce';
import { FaSearch, FaFilter, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { fetchMemes, setFilter, setSearchTerm } from '@/store/slices/memesSlice';
import { RootState, AppDispatch } from '@/store';
import MemeGrid from '@/components/ui/MemeGrid';
import Head from 'next/head';

const ExplorePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status, filter, searchTerm } = useSelector((state: RootState) => state.memes);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'likes' | 'date' | 'none'>('none');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filteredMemes, setFilteredMemes] = useState(items);
  const [displayCount, setDisplayCount] = useState(12);
  
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  // Fetch memes on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMemes());
    }
  }, [dispatch, status]);

  // Filter and sort memes when dependencies change
  useEffect(() => {
    let result = [...items];
    
    // Apply category filter
    if (filter !== 'all') {
      result = result.filter(meme => 
        meme.category?.toLowerCase() === filter.toLowerCase()
      );
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(meme => 
        meme.name.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    if (sortBy !== 'none') {
      result.sort((a, b) => {
        if (sortBy === 'likes') {
          return sortOrder === 'asc' 
            ? (a.likes || 0) - (b.likes || 0) 
            : (b.likes || 0) - (a.likes || 0);
        } else if (sortBy === 'date') {
          return sortOrder === 'asc'
            ? new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime()
            : new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        }
        return 0;
      });
    }
    
    setFilteredMemes(result);
  }, [items, filter, searchTerm, sortBy, sortOrder]);

  // Load more memes when scrolling to the bottom
  useEffect(() => {
    if (inView && displayCount < filteredMemes.length) {
      setDisplayCount(prev => Math.min(prev + 8, filteredMemes.length));
    }
  }, [inView, filteredMemes.length, displayCount]);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      dispatch(setSearchTerm(value));
    }, 500),
    [dispatch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const handleFilterChange = (newFilter: string) => {
    dispatch(setFilter(newFilter));
    setIsFilterOpen(false);
  };

  const handleSortChange = (newSortBy: 'likes' | 'date' | 'none') => {
    if (sortBy === newSortBy) {
      // Toggle sort order if clicking the same sort option
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc'); // Default to descending when changing sort type
    }
  };

  const toggleFilterMenu = () => {
    setIsFilterOpen(prev => !prev);
  };

  const displayedMemes = filteredMemes.slice(0, displayCount);
  const isLoading = status === 'loading';

  return (
    <>
      <Head>
        <title>Explore Memes | MemeVerse</title>
        <meta name="description" content="Explore the funniest memes on MemeVerse" />
      </Head>

      <div className="bg-primary-50 dark:bg-dark-800 min-h-screen">
        <div className="container-custom mx-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-8 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 text-transparent bg-clip-text">
              Explore Memes
            </h1>
          </motion.div>

          {/* Search and filter bar */}
          <motion.div 
            className="mb-8 bg-white dark:bg-dark-700 rounded-xl shadow-md p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search input */}
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search memes..."
                  className="input pl-10"
                  onChange={handleSearchChange}
                  defaultValue={searchTerm}
                />
              </div>

              {/* Filter dropdown */}
              <div className="relative">
                <button
                  onClick={toggleFilterMenu}
                  className="btn btn-outline flex items-center space-x-2"
                >
                  <FaFilter />
                  <span>
                    {filter === 'all' ? 'All Categories' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </span>
                </button>

                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-700 rounded-md shadow-lg z-10"
                  >
                    <ul className="py-1">
                      {['all', 'trending', 'new', 'classic', 'random'].map((category) => (
                        <li key={category}>
                          <button
                            onClick={() => handleFilterChange(category)}
                            className={`block px-4 py-2 text-sm w-full text-left hover:bg-primary-100 dark:hover:bg-dark-600 ${
                              filter === category
                                ? 'bg-primary-200 dark:bg-primary-900 font-medium'
                                : ''
                            }`}
                          >
                            {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>

              {/* Sort options */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSortChange('likes')}
                  className={`btn ${
                    sortBy === 'likes'
                      ? 'btn-primary'
                      : 'btn-outline'
                  } flex items-center space-x-2`}
                >
                  {sortBy === 'likes' && sortOrder === 'asc' ? (
                    <FaSortAmountUp />
                  ) : (
                    <FaSortAmountDown />
                  )}
                  <span>Likes</span>
                </button>

                <button
                  onClick={() => handleSortChange('date')}
                  className={`btn ${
                    sortBy === 'date'
                      ? 'btn-primary'
                      : 'btn-outline'
                  } flex items-center space-x-2`}
                >
                  {sortBy === 'date' && sortOrder === 'asc' ? (
                    <FaSortAmountUp />
                  ) : (
                    <FaSortAmountDown />
                  )}
                  <span>Date</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Results count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 text-gray-600 dark:text-gray-400"
          >
            {!isLoading && (
              <p>
                Showing {Math.min(displayCount, filteredMemes.length)} of {filteredMemes.length} results
              </p>
            )}
          </motion.div>

          {/* Meme grid */}
          <MemeGrid memes={displayedMemes} loading={isLoading} />

          {/* Load more trigger */}
          {!isLoading && displayCount < filteredMemes.length && (
            <div ref={ref} className="h-20 flex items-center justify-center mt-8">
              <div className="animate-pulse text-primary-600 dark:text-primary-400">
                Loading more memes...
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExplorePage;