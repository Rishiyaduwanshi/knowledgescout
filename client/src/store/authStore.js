import { create } from 'zustand';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  initAuth: async () => {
    const { isLoading } = get();
    if (isLoading) {
      console.log('initAuth: Already loading, skipping...');
      return;
    }

    console.log('initAuth: Starting authentication check...');
    set({ isLoading: true });
    try {
      const response = await authAPI.getProfile();
      console.log('initAuth response:', response);
      if (response.success && response.data.user) {
        set({
          user: response.data.user,
          isAuthenticated: true,
        });
        console.log('User authenticated:', response.data.user);
      } else {
        set({
          user: null,
          isAuthenticated: false,
        });
        console.log('No user found in response');
      }
    } catch (error) {
      console.log('initAuth error:', error.message);
      console.log('Error details:', error.response?.data || 'No response data');
      set({
        user: null,
        isAuthenticated: false,
      });
    } finally {
      set({ isLoading: false });
      console.log('initAuth: Finished');
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.login(credentials);
      console.log('Login response:', response);
      if (response.success && response.data.user) {
        set({
          user: response.data.user,
          isAuthenticated: true,
        });
        console.log('Login successful, user set:', response.data.user);
        toast.success('Login successful!');
        return { success: true };
      } else {
        console.log('Login failed - no user in response');
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.log('Login error:', error);
      toast.error(
        error.response?.data?.message || error.message || 'Login failed'
      );
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const response = await authAPI.register(userData);
      if (response.success) {
        toast.success('Registration successful! Please login.');
        return { success: true };
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'Registration failed'
      );
      return { success: false, error: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      toast.success('Logged out successfully');
    }
  },

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),

  isAdmin: () => {
    const { user } = get();
    return user && (user.role === 'admin' || user.isAdmin);
  },
}));
