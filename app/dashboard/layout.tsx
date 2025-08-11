'use client';

import type React from 'react';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  Building,
  Shield,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageToggle } from '@/components/language-toggle';
import { useLanguage } from '@/components/language-provider';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageLoader } from '@/components/ui/loader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { logout, user } = useAuth();

  const getNavigation = () => {
    const baseNavigation = [
      { name: t('dashboard'), href: '/dashboard', icon: BarChart3 },
      { name: t('allEmployees'), href: '/dashboard/employees', icon: Users },
      {
        name: t('allComplaints'),
        href: '/dashboard/complaints',
        icon: MessageSquare,
      },
      { name: t('allFeedback'), href: '/dashboard/feedback', icon: FileText },
      { name: t('allRatings'), href: '/dashboard/ratings', icon: Star },
      { name: t('statistics'), href: '/dashboard/analytics', icon: BarChart3 },
    ];

    if (user?.role === 'SuperAdmin') {
      baseNavigation.push(
        { name: t('administration'), href: '/dashboard/admin', icon: Shield },
        {
          name: t('departments'),
          href: '/dashboard/departments',
          icon: Building,
        }
      );
    }

    baseNavigation.push({
      name: t('settings'),
      href: '/dashboard/settings',
      icon: Settings,
    });
    return baseNavigation;
  };

  const navigation = getNavigation();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.username;
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    return user.username.substring(0, 2).toUpperCase();
  };

  const getRoleDisplay = () => {
    if (!user) return '';
    switch (user.role) {
      case 'SuperAdmin':
        return t('superAdmin');
      case 'SubCityAdmin':
        return t('subCityAdmin');
      case 'Admin':
        return t('departmentAdmin');
      default:
        return user.role;
    }
  };

  const getLocationDisplay = () => {
    if (!user) return '';
    if (user.subcity) {
      return `${user.subcity}, ${user.city || 'Addis Ababa'}`;
    }
    if (user.department) {
      return user.department;
    }
    return user.city || '';
  };

  return (
    <div className="flex min-h-screen flex-col bg-blue-50 dark:bg-blue-950">
      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-white dark:bg-blue-900 px-4 sm:static md:hidden">
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t('toggleMenu')}</span>
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">{t('appName')}</span>
        </div>
      </header>

      {/* Mobile sidebar */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-blue-900 md:hidden">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{t('appName')}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">{t('closeMenu')}</span>
            </Button>
          </div>
          <nav className="grid gap-2 p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            <div className="mt-4 flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <Button
              variant="outline"
              className="mt-4 w-full justify-start gap-3"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {t('logout')}
            </Button>
          </nav>
        </div>
      )}

      <div className="flex flex-1 flex-col md:grid md:grid-cols-[auto_1fr]">
        {/* Desktop sidebar */}
        <aside
          className={`hidden border-r bg-white dark:bg-blue-900 md:flex md:flex-col ${
            isSidebarCollapsed ? 'md:w-[70px]' : 'md:w-[260px] lg:w-[280px]'
          } transition-all duration-300`}
        >
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-semibold text-gray-900 dark:text-white">{t('appName')}</span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* User Profile Section */}
          {!isSidebarCollapsed && (
            <div className="border-b p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profilePicture} alt={getUserDisplayName()} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {getRoleDisplay()}
                  </p>
                  {getLocationDisplay() && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {getLocationDisplay()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-auto py-4">
            <nav className="grid gap-1 px-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {!isSidebarCollapsed && <span>{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Logout Button */}
          <div className="border-t p-3">
            <Button
              variant="ghost"
              className={`w-full justify-start gap-3 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800 ${
                isSidebarCollapsed ? 'px-2' : ''
              }`}
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              {!isSidebarCollapsed && <span>{t('logout')}</span>}
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          {/* Desktop header - Fixed */}
          <header
            className="hidden md:flex h-16 items-center justify-between border-b bg-white dark:bg-blue-900 px-6 fixed top-0 right-0 z-30 rounded-br-lg"
            style={{ left: isSidebarCollapsed ? '70px' : '280px' }} // Move this to CSS
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder={t('search')}
                  className="w-64 pl-10 bg-blue-50 dark:bg-blue-800 border-blue-200 dark:border-blue-700 rounded-lg"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative rounded-lg">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                <span className="sr-only">{t('notifications')}</span>
              </Button>
              <LanguageToggle />
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profilePicture} alt={getUserDisplayName()} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-lg" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {getRoleDisplay()}
                      </p>
                      {getLocationDisplay() && (
                        <p className="text-xs leading-none text-muted-foreground">
                          {getLocationDisplay()}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Content with top padding to account for fixed header */}
          <main className="flex-1 p-6 pt-20">
            <Suspense fallback={<PageLoader />}>{children}</Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
