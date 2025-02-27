import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  profilePicture: string;
  createdAt: string;
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
}

// Initialize with a default user for demo purposes
const initialUser: User = {
  id: '1',
  name: 'Meme Lover',
  email: 'meme@example.com',
  bio: 'I love creating and sharing memes!',
  profilePicture: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
  createdAt: new Date().toISOString()
};

const initialState: UserState = {
  currentUser: initialUser,
  isAuthenticated: true // Set to true for demo purposes
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload
        };
      }
    },
    login: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    }
  }
});

export const { updateProfile, login, logout } = userSlice.actions;

export default userSlice.reducer;