'use client';

import type React from 'react';

import { Suspense, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  Users,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Bell,
  Search,
  Building2,
  Star,
  UsersRound,
  Building,
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
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useOrganization } from '@/hooks/use-organization';
import { PICTURE_URL } from '@/constants/base_url';
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
import { useNotifications } from '@/hooks/use-notifications';
import { ActivityLog } from '@/types/notifications';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { Subcities } = useOrganization();
  const { Notifications } = useNotifications();

  useEffect(() => {
    console.log(Notifications);
  }, [Notifications]);
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  const mainNavigation = [
    { name: t('superAdminDashboard'), href: '/superadmin', icon: BarChart3 },
    {
      name: t('allComplaints'),
      href: '/superadmin/complaints',
      icon: MessageSquare,
    },
    { name: t('allEmployees'), href: '/superadmin/employees', icon: Users },
    { name: t('allFeedback'), href: '/superadmin/feedback', icon: FileText },
    { name: t('allRatings'), href: '/superadmin/ratings', icon: Star },
    { name: t('Organization'), href: '/superadmin/organization', icon: Building2 },
    { name: t('Admins'), href: '/superadmin/admins', icon: UsersRound },
    { name: 'Subcities', href: '/superadmin/sections', icon: Building },
    { name: t('analytics'), href: '/superadmin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/superadmin/settings', icon: Settings },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        {/* Sidebar - floating, icon-collapsible */}
        <Sidebar variant="floating" collapsible="icon" className="z-30">
          <SidebarHeader className="border-b px-6 py-3">
            <Link href="/superadmin" className="flex items-center gap-2">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logos-removebg-preview-ZSzaSFuDxZhWUNiUwKrbxsvdKDd6MU.png"
                alt="FM Logo"
                width={32}
                height={32}
                className="h-8 w-8 flex-shrink-0"
              />
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="font-semibold">{t('superAdminDashboard')}</span>
                <span className="text-xs text-muted-foreground">{t('systemAdministrator')}</span>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            {/* Main Navigation */}
            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                {t('mainNavigation')}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNavigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={pathname === item.href}>
                          <Link href={item.href}>
                            <Icon className="h-5 w-5" />
                            <span>{item.name}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Sub Cities Category */}
            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
                Sub Cities
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuSub>
                      {Subcities.map((sub) => (
                        <SidebarMenuSubItem key={sub.id}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={
                              pathname ===
                              `/superadmin/subcities/addis-ababa/${sub.name_en.toLowerCase().replace(/\s+/g, '-')}`
                            }
                          >
                            <Link
                              href={`/superadmin/subcities/addis-ababa/${sub.name_en.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              {sub.name_en}
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Topbar */}
          <div className="h-14 flex items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-4">
              {/* Sidebar Trigger for collapse/expand */}
              <SidebarTrigger className="md:inline-flex" />
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
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
                        <p className="text-sm capitalize ">
                          {generateNotificationMessage(notification)}
                        </p>
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
                  <DropdownMenuLabel>{user?.username || t('superAdmin')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>{t('logout')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex-1 p-4 md:p-6">
            <Suspense fallback={<div>{t('loading')}</div>}>{children}</Suspense>
          </div>
        </div>
      </div>
    </SidebarProvider>
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
