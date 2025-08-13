import { Subcities } from '@/types/subcities';
import { User } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  clearError: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  initialize: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      // Initialize from localStorage if available
      const initializeFromStorage = () => {
        try {
          const token = localStorage.getItem('token');
          const adminStr = localStorage.getItem('admin');
          if (token && adminStr) {
            const user = JSON.parse(adminStr);
            console.log('🔐 Auth Store - Initializing from localStorage:', {
              token: token.substring(0, 20) + '...',
              user,
            });
            set({ token, user, isAuthenticated: true, error: null });
            return true;
          }
        } catch (error) {
          console.error('🔐 Auth Store - Failed to initialize from localStorage:', error);
        }
        return false;
      };

      return {
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        login: (token, user) => {
          console.log('🔐 Auth Store - Login called with:', {
            token: token.substring(0, 20) + '...',
            user,
          });
          set({ token, user, isAuthenticated: true, error: null });
          // Also store in localStorage for backward compatibility
          localStorage.setItem('token', token);
          localStorage.setItem('admin', JSON.stringify(user));
        },
        logout: () => {
          console.log('🔐 Auth Store - Logout called');
          set({ token: null, user: null, isAuthenticated: false });
          // Also clear from localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('admin');
        },
        clearError: () => set({ error: null }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        // Initialize from localStorage when store is created
        initialize: () => initializeFromStorage(),
      };
    },
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper functions for auth
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'SuperAdmin' || user?.role === 'SubCityAdmin' || user?.role === 'Admin';
};

export const isSuperAdmin = (user: User | null): boolean => {
  return user?.role === 'SuperAdmin';
};

export const isSubCityAdmin = (user: User | null): boolean => {
  return user?.role === 'SubCityAdmin';
};

export const isDepartmentAdmin = (user: User | null): boolean => {
  return user?.role === 'Admin';
};

// export const hasAccessToSection = (user: User | null, section: string): boolean => {
//   if (!user) return false;
//   if (user.role === 'SuperAdmin') return true;
//   if (user.role === 'SubCityAdmin') return user.subcity === subcity.name_en;
//   return user.section === section || user.section === 'all';
// };

export const hasAccessToDepartment = (user: User | null, department: string): boolean => {
  if (!user) return false;
  if (user.role === 'SuperAdmin') return true;
  // if (user.role === 'Admin') return user.department === department;
  return false;
};

// export const hasAccessToSubcity = (user: User | null, subcity: string): boolean => {
//   if (!user) return false;
//   if (user.role === 'SuperAdmin') return true;
//   if (user.role === 'SubCityAdmin') return user.subcity === subcity;
//   return false;
// };
