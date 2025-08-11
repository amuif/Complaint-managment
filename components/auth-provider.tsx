'use client';

import { createContext, useContext, type ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isSubCityAdmin: boolean;
  userSection: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: false,
  isSuperAdmin: false,
  isSubCityAdmin: false,
  userSection: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user, initialize } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth store from localStorage on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  const isSuperAdmin = user?.role === 'SuperAdmin';
  const isSubCityAdmin = user?.role === 'SubCityAdmin';
  const userSection = user?.section || null;

  // Route protection logic
  useEffect(() => {
    // Skip for public routes
    if (
      pathname === '/' ||
      pathname === '/login' ||
      pathname === '/signup' ||
      pathname === '/services' ||
      pathname === '/employees' ||
      pathname === '/feedback' ||
      pathname === '/complaints'
    ) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated && pathname.includes('/dashboard')) {
      router.push('/login');
    }

    // Redirect to dashboard if authenticated but trying to access login/signup
    if (!isLoading && isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
      router.push('/dashboard');
    }

    // Redirect to dashboard if trying to access superadmin without permissions
    if (!isLoading && isAuthenticated && pathname.includes('/superadmin') && !isSuperAdmin) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, pathname, router, isSuperAdmin]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        isSuperAdmin,
        isSubCityAdmin,
        userSection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
