'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, Mail, Phone, Lock, Camera, User2 } from 'lucide-react';
import { updateAuthUser, useAuthStore } from '@/lib/auth-store';
import { adminRoles, User } from '@/types/user';
import { PICTURE_URL } from '@/constants/base_url';
import { useAuth } from '@/hooks/use-auth';
import { handleApiError, handleApiSuccess } from '@/lib/error-handler';

// Unified schema
const userSchema = z
  .object({
    // Profile fields
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional().or(z.literal('')),
    // Password fields (optional for profile updates)
    currentPassword: z.string().optional(),
    newPassword: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 4, 'Password must be at least 4 characters'),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }
  );

type UserFormData = z.infer<typeof userSchema>;

// Default user data for initial state
const defaultUserData: Partial<User> = {
  email: '',
  phone: '',
  is_active: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export default function SystemSettingsPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<Partial<User>>(defaultUserData);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [isClient, setIsClient] = useState(false);
  const { selfUpdateAdmin } = useAuth();

  // Set client-side flag and initialize user data
  useEffect(() => {
    setIsClient(true);
    if (user) {
      setUserData(user);
      if (user.profile_picture) {
        // If profile_picture is a File object, create a preview
        if (user.profile_picture instanceof File) {
          setProfilePicturePreview(URL.createObjectURL(user.profile_picture));
        } else if (typeof user.profile_picture === 'string') {
          // If it's a string (URL), use it directly
          setProfilePicturePreview(`${PICTURE_URL}${user.profile_picture}`);
        }
      }
    }
  }, [user]);

  // Unified form with object destructuring
  const { register, handleSubmit, reset, formState } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: user?.email || '',
      phone: user?.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    console.log(user);
  }, [user]);
  useEffect(() => {
    console.log('Form state:', formState);
    console.log('Errors:', formState.errors);
  }, [formState]);

  useEffect(() => {
    if (user) {
      reset({
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);

    if (data.currentPassword) formData.append('currentPassword', data.currentPassword || '');
    if (data.newPassword) formData.append('newPassword', data.newPassword);

    if (profilePictureFile) {
      formData.append('profile_picture', profilePictureFile);
    }
    console.group('FormData Preview');
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: File(name=${value.name}, size=${value.size}, type=${value.type})`);
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    console.groupEnd();
    try {
      const response = await selfUpdateAdmin(formData);
      handleApiSuccess(response.message);
      updateAuthUser(response.admin);
      setProfilePictureFile(null);
      reset();
    } catch (error) {
      handleApiError(error, 'Failed to update profile');
      console.error('Failed to update admin:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePicturePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Show loading state until client-side rendering is complete
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 pb-6 border-b">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={
              profilePicturePreview
                ? profilePicturePreview
                : `${PICTURE_URL}${user?.profile_picture}` || undefined
            }
          />
          <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
            {user?.first_name?.[0] || 'U'}
            {user?.last_name?.[0] || 'S'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Manage your profile and system configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={user?.is_active ? 'default' : 'secondary'} className="gap-1">
            <div
              className={`w-2 h-2 rounded-full ${user?.is_active ? 'bg-green-500' : 'bg-gray-400'}`}
            />
            {user?.is_active ? 'Active' : 'Inactive'}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Shield className="w-3 h-3" />
            {user?.role}
          </Badge>
        </div>
      </div>
      <div className="flex items-center justify-start gap-1">
        {' '}
        <User2 className="w-4 h-4" />
        Profile
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Profile Picture
            </CardTitle>
            <CardDescription>Upload or change your profile picture</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={
                  profilePicturePreview
                    ? profilePicturePreview
                    : `${PICTURE_URL}${user?.profile_picture}` || undefined
                }
              />
              <AvatarFallback className="text-2xl font-semibold bg-blue-100 text-blue-700">
                {user?.first_name?.[0] || 'U'}
                {user?.last_name?.[0] || 'S'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Label htmlFor="profilePicture" className="cursor-pointer">
                <Button type="button" variant="outline" className="gap-2 bg-transparent" asChild>
                  <span>
                    <Camera className="w-4 h-4" />
                    Choose Photo
                  </span>
                </Button>
              </Label>
              <Input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
              <p className="text-sm text-muted-foreground mt-2">PNG or GIF. Max file size 5MB.</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User2 className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="border border-gray-300 focus:border-blue-500"
                />
                {formState.errors.email && (
                  <p className="text-sm text-red-500">{formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="Enter phone number"
                  className="border border-gray-300 focus:border-blue-500"
                />
                {formState.errors.phone && (
                  <p className="text-sm text-red-500">{formState.errors.phone.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Update Password
              </CardTitle>
              <CardDescription>Change your account password for security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...register('currentPassword')}
                  placeholder="Enter current password"
                  className="border border-gray-300 focus:border-blue-500"
                />
                {formState.errors.currentPassword && (
                  <p className="text-sm text-red-500">{formState.errors.currentPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...register('newPassword')}
                  placeholder="Enter new password"
                  className="border border-gray-300 focus:border-blue-500"
                />
                {formState.errors.newPassword && (
                  <p className="text-sm text-red-500">{formState.errors.newPassword.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  placeholder="Confirm new password"
                  className="border border-gray-300 focus:border-blue-500"
                />
                {formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">{formState.errors.confirmPassword.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading} size="lg">
            {isLoading ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
}
