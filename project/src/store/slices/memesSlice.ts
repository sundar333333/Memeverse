import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Meme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
  captions?: number;
  category?: string;
  likes?: number;
  comments?: Comment[];
  createdAt?: string;
  uploadedBy?: string;
}

export interface Comment {
  id: string;
  text: string;
  user: string;
  createdAt: string;
}

interface MemesState {
  items: Meme[];
  trending: Meme[];
  userMemes: Meme[];
  likedMemes: string[];
  currentMeme: Meme | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filter: string;
  searchTerm: string;
}

const initialState: MemesState = {
  items: [],
  trending: [],
  userMemes: [],
  likedMemes: [],
  currentMeme: null,
  status: 'idle',
  error: null,
  filter: 'trending',
  searchTerm: '',
};

// Load liked memes from localStorage
const loadLikedMemes = (): string[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('likedMemes');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

// Async thunks
export const fetchMemes = createAsyncThunk('memes/fetchMemes', async () => {
  const response = await axios.get('https://api.imgflip.com/get_memes');
  return response.data.data.memes;
});

export const fetchTrendingMemes = createAsyncThunk('memes/fetchTrendingMemes', async () => {
  // In a real app, you'd have a separate API for trending memes
  // For now, we'll use the same API and just take the first 10
  const response = await axios.get('https://api.imgflip.com/get_memes');
  return response.data.data.memes.slice(0, 10);
});

export const fetchMemeById = createAsyncThunk('memes/fetchMemeById', 
  async (id: string, { getState }) => {
    const state = getState() as { memes: MemesState };
    
    // First check if we already have this meme in our state
    const existingMeme = state.memes.items.find(meme => meme.id === id);
    if (existingMeme) return existingMeme;
    
    // If not, fetch it from the API
    const response = await axios.get('https://api.imgflip.com/get_memes');
    const allMemes = response.data.data.memes;
    const meme = allMemes.find((m: Meme) => m.id === id);
    
    if (!meme) {
      throw new Error('Meme not found');
    }
    
    return {
      ...meme,
      likes: Math.floor(Math.random() * 1000),
      comments: [],
      category: ['Trending', 'New', 'Classic', 'Random'][Math.floor(Math.random() * 4)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
    };
  }
);

const memesSlice = createSlice({
  name: 'memes',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    toggleLikeMeme: (state, action: PayloadAction<string>) => {
      const memeId = action.payload;
      const likedIndex = state.likedMemes.indexOf(memeId);
      
      if (likedIndex === -1) {
        // Add to liked memes
        state.likedMemes.push(memeId);
        
        // Increment likes count on the meme
        const meme = state.items.find(m => m.id === memeId);
        if (meme) {
          meme.likes = (meme.likes || 0) + 1;
        }
        
        // Also update trending memes if needed
        const trendingMeme = state.trending.find(m => m.id === memeId);
        if (trendingMeme) {
          trendingMeme.likes = (trendingMeme.likes || 0) + 1;
        }
        
        // Also update current meme if needed
        if (state.currentMeme && state.currentMeme.id === memeId) {
          state.currentMeme.likes = (state.currentMeme.likes || 0) + 1;
        }
      } else {
        // Remove from liked memes
        state.likedMemes.splice(likedIndex, 1);
        
        // Decrement likes count on the meme
        const meme = state.items.find(m => m.id === memeId);
        if (meme && meme.likes && meme.likes > 0) {
          meme.likes -= 1;
        }
        
        // Also update trending memes if needed
        const trendingMeme = state.trending.find(m => m.id === memeId);
        if (trendingMeme && trendingMeme.likes && trendingMeme.likes > 0) {
          trendingMeme.likes -= 1;
        }
        
        // Also update current meme if needed
        if (state.currentMeme && state.currentMeme.id === memeId && 
            state.currentMeme.likes && state.currentMeme.likes > 0) {
          state.currentMeme.likes -= 1;
        }
      }
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('likedMemes', JSON.stringify(state.likedMemes));
      }
    },
    addComment: (state, action: PayloadAction<{ memeId: string, comment: Comment }>) => {
      const { memeId, comment } = action.payload;
      
      // Update in items array
      const meme = state.items.find(m => m.id === memeId);
      if (meme) {
        if (!meme.comments) {
          meme.comments = [];
        }
        meme.comments.push(comment);
      }
      
      // Update in trending array
      const trendingMeme = state.trending.find(m => m.id === memeId);
      if (trendingMeme) {
        if (!trendingMeme.comments) {
          trendingMeme.comments = [];
        }
        trendingMeme.comments.push(comment);
      }
      
      // Update current meme if needed
      if (state.currentMeme && state.currentMeme.id === memeId) {
        if (!state.currentMeme.comments) {
          state.currentMeme.comments = [];
        }
        state.currentMeme.comments.push(comment);
      }
    },
    addUserMeme: (state, action: PayloadAction<Meme>) => {
      const newMeme = action.payload;
      state.userMemes.unshift(newMeme);
      state.items.unshift(newMeme);
    },
    initializeLikedMemes: (state) => {
      state.likedMemes = loadLikedMemes();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMemes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMemes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Add likes and comments properties to each meme
        const memesWithExtras = action.payload.map((meme: Meme) => ({
          ...meme,
          likes: Math.floor(Math.random() * 1000),
          comments: [],
          category: ['Trending', 'New', 'Classic', 'Random'][Math.floor(Math.random() * 4)],
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
        }));
        state.items = memesWithExtras;
      })
      .addCase(fetchMemes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch memes';
      })
      .addCase(fetchTrendingMemes.fulfilled, (state, action) => {
        // Add likes and comments properties to each meme
        const memesWithExtras = action.payload.map((meme: Meme) => ({
          ...meme,
          likes: Math.floor(Math.random() * 1000),
          comments: [],
          category: 'Trending',
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
        }));
        state.trending = memesWithExtras;
      })
      .addCase(fetchMemeById.fulfilled, (state, action) => {
        state.currentMeme = action.payload;
      });
  },
});

export const { 
  setFilter, 
  setSearchTerm, 
  toggleLikeMeme, 
  addComment, 
  addUserMeme,
  initializeLikedMemes
} = memesSlice.actions;

export default memesSlice.reducer;