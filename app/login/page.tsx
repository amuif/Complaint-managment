'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/components/language-provider';
import { LanguageToggle } from '@/components/language-toggle';
import { ThemeToggle } from '@/components/theme-toggle';
import { ClientOnly } from '@/components/client-only';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, Building2, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, isLoggingIn, loginError, clearError } = useAuth();
  const { t } = useLanguage();

  // Clear errors when component mounts or when inputs change
  useEffect(() => {
    clearError();
  }, [username, password, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;

    console.log('🔐 Login form submitting with:', {
      username: username.trim(),
      password: '***',
    });
    login({ username: username.trim(), password: password });
  };

  const quickFillDemo = (demoUsername: string, demoPassword: string) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-blue-950 flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-2/5 relative bg-blue-900 dark:bg-blue-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-blue-900 dark:from-blue-700 dark:to-blue-800"></div>
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 600" fill="none">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center p-8 text-white w-full">
          <div className="text-center max-w-md">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">{t('appName')}</h1>
                <p className="text-slate-300 text-sm mt-1">Admin Portal</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-medium text-sm mb-1">Unified Management</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Streamline your office operations with comprehensive employee, complaint, and
                    service management.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-medium text-sm mb-1">Role-Based Access</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Secure access control with different permission levels for SuperAdmin, SubCity,
                    and Department roles.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-medium text-sm mb-1">Real-time Analytics</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Monitor performance metrics and generate insights with advanced reporting
                    capabilities.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-slate-400 text-xs">
                © 2024 Office Management System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-sm">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-blue-900 dark:text-white">
                {t('appName')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClientOnly>
                <LanguageToggle />
                <ThemeToggle />
              </ClientOnly>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden lg:flex justify-end items-center gap-2 mb-6">
            <ClientOnly>
              <LanguageToggle />
              <ThemeToggle />
            </ClientOnly>
          </div>

          {/* Login Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-blue-900 dark:text-white mb-1">
              {t('loginTitle')}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">{t('loginSubtitle')}</p>
          </div>

          {/* Error Alert */}
          {loginError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription className="text-sm">{loginError}</AlertDescription>
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-1">
              <Label
                htmlFor="username"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {t('username')}
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder={t('usernamePlaceholder')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoggingIn}
                  className="pl-9 h-10 text-sm bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <Label
                htmlFor="password"
                className="text-xs font-medium text-slate-700 dark:text-slate-300"
              >
                {t('password')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoggingIn}
                  className="pl-9 pr-9 h-10 text-sm bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-10 px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoggingIn}
                >
                  {showPassword ? (
                    <EyeOff className="h-3 w-3 text-slate-400" />
                  ) : (
                    <Eye className="h-3 w-3 text-slate-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-10 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={isLoggingIn || !username.trim() || !password}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('signingIn')}
                </>
              ) : (
                <>
                  {t('signIn')}
                  <ArrowRight className="ml-2 h-3 w-3" />
                </>
              )}
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-700">
            <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <Lock className="h-3 w-3" />
              {t('demoAccounts')}
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-white dark:bg-blue-800 rounded-md border border-blue-200 dark:border-blue-600">
                <div>
                  <div className="text-xs font-medium text-blue-900 dark:text-white">
                    SuperAdmin
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    superadmin / password123
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickFillDemo('superadmin', 'password123')}
                  className="text-xs h-7 px-2"
                  disabled={isLoggingIn}
                >
                  Use
                </Button>
              </div>

              <div className="flex items-center justify-between p-2 bg-white dark:bg-blue-800 rounded-md border border-blue-200 dark:border-blue-600">
                <div>
                  <div className="text-xs font-medium text-blue-900 dark:text-white">
                    SubCity (Bole)
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    bole_admin / password123
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickFillDemo('bole_admin', 'password123')}
                  className="text-xs h-7 px-2"
                  disabled={isLoggingIn}
                >
                  Use
                </Button>
              </div>

              <div className="flex items-center justify-between p-2 bg-white dark:bg-blue-800 rounded-md border border-blue-200 dark:border-blue-600">
                <div>
                  <div className="text-xs font-medium text-blue-900 dark:text-white">
                    Control Dept
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    control_admin / password123
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickFillDemo('control_admin', 'password123')}
                  className="text-xs h-7 px-2"
                  disabled={isLoggingIn}
                >
                  Use
                </Button>
              </div>

              <div className="flex items-center justify-between p-2 bg-white dark:bg-blue-800 rounded-md border border-blue-200 dark:border-blue-600">
                <div>
                  <div className="text-xs font-medium text-blue-900 dark:text-white">
                    Engineering
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    engineering_admin / password123
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickFillDemo('engineering_admin', 'password123')}
                  className="text-xs h-7 px-2"
                  disabled={isLoggingIn}
                >
                  Use
                </Button>
              </div>

              <div className="flex items-center justify-between p-2 bg-white dark:bg-blue-800 rounded-md border border-blue-200 dark:border-blue-600">
                <div>
                  <div className="text-xs font-medium text-blue-900 dark:text-white">
                    Support Admin
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    support_admin / password123
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickFillDemo('support_admin', 'password123')}
                  className="text-xs h-7 px-2"
                  disabled={isLoggingIn}
                >
                  Use
                </Button>
              </div>

              <div className="flex items-center justify-between p-2 bg-white dark:bg-blue-800 rounded-md border border-blue-200 dark:border-blue-600">
                <div>
                  <div className="text-xs font-medium text-blue-900 dark:text-white">
                    Control Center
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    control_center_admin / password123
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => quickFillDemo('control_center_admin', 'password123')}
                  className="text-xs h-7 px-2"
                  disabled={isLoggingIn}
                >
                  Use
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
