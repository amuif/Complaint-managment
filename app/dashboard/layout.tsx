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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
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
import { adminRoles } from '@/types/user';
import { PICTURE_URL } from '@/constants/base_url';
import { ActivityLog } from '@/types/notifications';
import { useNotifications } from '@/hooks/use-notifications';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { logout, user } = useAuth();
  const { Notifications } = useNotifications();

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
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    ];

    if (user?.role === adminRoles.SuperAdmin) {
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
    return user?.username?.substring(0, 2).toUpperCase();
  };

  const getRoleDisplay = () => {
    if (!user) return '';
    switch (user.role) {
      case adminRoles.SuperAdmin:
        return t('superAdmin');
      case adminRoles.SuperAdminSupporter:
        return t('subCityAdmin');
      case adminRoles.Admin:
        return t('departmentAdmin');
      default:
        return user.role;
    }
  };

  const getLocationDisplay = () => {
    if (!user) return '';
    if (user.subcity) {
      return `${user.subcity.name_en}, ${user.city || 'Addis Ababa'}`;
    }
    if (user.department) {
      return user.department;
    }
    return user.city || '';
  };

  return (
    <div className="flex min-h-screen flex-col bg-blue-50 dark:bg-blue-950">
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
                  <AvatarImage
                    src={`${PICTURE_URL}${user?.profile_picture}`}
                    alt={getUserDisplayName()}
                  />
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
                      {user?.subcity?.name_en || user?.department?.name_en}
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
              {/* <Button variant="ghost" size="icon" className="relative rounded-lg"> */}
              {/*   <Bell className="h-5 w-5" /> */}
              {/*   <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span> */}
              {/*   <span className="sr-only">{t('notifications')}</span> */}
              {/* </Button> */}
              {/* <LanguageToggle /> */}
              <ThemeToggle />
              <div className="flex items-center gap-4">
                <Drawer direction="right">
                  <DrawerTrigger>
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Notifications</span>
                  </DrawerTrigger>
                  <DrawerContent className="h-screen w-[30%] ml-auto border-l bg-background">
                    <DrawerHeader className="flex items-center justify-between border-b px-4 py-3">
                      <DrawerTitle className="text-lg font-semibold">Notifications</DrawerTitle>
                      {Notifications.length > 0 && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {Notifications.length} new
                        </span>
                      )}
                    </DrawerHeader>
                    <div className="flex-1 p-4 overflow-y-auto">
                      {Notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="p-3 border-b border-gray-200 last:border-b-0"
                        >
                          <p className="text-sm ">{generateNotificationMessage(notification)}</p>
                          <p className="text-xs  mt-1">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))}
                      {Notifications.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No notifications</p>
                      )}
                    </div>
                  </DrawerContent>
                </Drawer>{' '}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={`${PICTURE_URL}${user?.profile_picture}`}
                          alt={user?.username || 'Admin'}
                        />
                        <AvatarFallback>
                          {user?.username?.slice(0, 2).toUpperCase() || 'SA'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel className="capitalize">
                      {user?.username || t('superAdmin')}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>{t('logout')}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
const generateNotificationMessage = (notification: ActivityLog) => {
  const { action, entity_type, entity_id, admin_id } = notification;

  const entityName = entity_type.charAt(0).toUpperCase() + entity_type.slice(1);
  const actionText = action.toLowerCase();

  const actor = admin_id ? `Admin ${notification.admin.username}` : 'System';

  switch (action) {
    case 'CREATE':
      return `${actor} created a new ${entityName}`;

    case 'UPDATE':
      return `${actor} updated ${entityName} `;

    case 'DELETE':
      return `${actor} deleted ${entityName}`;

    default:
      return `${actor} performed ${actionText} on ${entityName} #${entity_id}`;
  }
};
