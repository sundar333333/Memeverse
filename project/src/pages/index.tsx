import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchTrendingMemes } from '@/store/slices/memesSlice';
import { AppDispatch } from '@/store';
import Head from 'next/head';
import Hero from '@/components/ui/Hero';
import TrendingSection from '@/components/ui/TrendingSection';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { trending, status } = useSelector((state: RootState) => state.memes);

  useEffect(() => {
    dispatch(fetchTrendingMemes());
  }, [dispatch]);

  return (
    <>
      <Head>
        <title>MemeVerse | Your Ultimate Meme Destination</title>
        <meta name="description" content="Explore, create, and share the funniest memes on the internet with MemeVerse." />
      </Head>

      <div className="min-h-screen">
        <Hero />
        
        <TrendingSection 
          memes={trending} 
          loading={status === 'loading'} 
        />
      </div>
    </>
  );
};

export default HomePage;