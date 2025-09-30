'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { adminRoles, type User } from '@/types/user';
import { useAuth } from '@/hooks/use-auth';
import { useOrganization } from '@/hooks/use-organization';
import { handleApiError, handleApiSuccess } from '@/lib/error-handler';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/auth-store';
import { useEffect, useState } from 'react';
import { Division } from '@/types/division';
import { Department } from '@/types/department';

const roleHierarchy = [
  adminRoles.SuperAdmin,
  adminRoles.SuperAdminSupporter,
  adminRoles.Admin,
  adminRoles.Editor,
  adminRoles.Viewer,
];

const mapRoleToNumber = (role: string | undefined): adminRoles | undefined => {
  switch (role) {
    case 'SuperAdmin':
      return adminRoles.SuperAdmin;
    case 'SuperAdminSupporter':
      return adminRoles.SuperAdminSupporter;
    case 'Admin':
      return adminRoles.Admin;
    case 'Editor':
      return adminRoles.Editor;
    case 'Viewer':
      return adminRoles.Viewer;
    default:
      console.warn('Unknown role:', role);
      return undefined;
  }
};

function getCreatableRoles(currentRole: adminRoles | string | undefined): adminRoles[] {
  const roleNumber = typeof currentRole === 'string' ? mapRoleToNumber(currentRole) : currentRole;
  if (!roleNumber && roleNumber !== 0) {
    console.log('No valid role provided:', currentRole);
    return [];
  }
  const index = roleHierarchy.indexOf(roleNumber as adminRoles);
  if (index === -1) {
    console.log('Invalid role:', roleNumber);
    return [];
  }
  return roleHierarchy.slice(index + 1);
}

const userCreateSchema = z.object({
  profile_picture: z.instanceof(File).optional().or(z.string().optional()),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email').optional(),
  phone: z.string().min(1, 'Phone is required'),
  city: z.string().min(1, 'City is required'),
  role: z.string(),
  subcity_id: z.string().optional(),
  sector_id: z.string().min(1, 'Sector is required').optional(),
  division_id: z.string().optional(),
  department_id: z.string().optional(),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  failed_login_attempts: z.string().default('0'),
});

type UserCreateSchema = z.infer<typeof userCreateSchema>;

interface UserCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserCreateDialog({ open, onOpenChange }: UserCreateDialogProps) {
  const { createAdmin } = useAuth();
  const { user } = useAuthStore() as { user: User | undefined }; // Type assertion for user
  const { Sectors, Directors, Teams, Subcities } = useOrganization();
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);
  const [filteredDirectors, setFilteredDirectors] = useState<Division[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Department[]>([]);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedDirector, setSelectedDirector] = useState<string | null>(null);

  useEffect(() => {
    if (user !== undefined) {
      setIsUserLoading(false);
      if (!user || !user.role) {
        setUserError('Failed to load user role data');
      } else {
        console.log('User data:', { user, role: user.role, roleType: typeof user.role });
      }
    }
  }, [user]);

  useEffect(() => {
    const filteredDirectors = Directors.filter((director) => director.sector_id == selectedSector);
    const filteredTeams = Teams.filter((team) => team.division_id == selectedDirector?.toString());
    setFilteredDirectors(filteredDirectors);
    setFilteredTeams(filteredTeams);
  }, [selectedSector, selectedDirector]);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<UserCreateSchema>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      role: adminRoles.Viewer,
    },
  });

  const profilePicture = watch('profile_picture');
  const firstName = watch('first_name');
  const lastName = watch('last_name');

  const onSubmit = async (data: UserCreateSchema) => {
    if (isUserLoading) {
      handleApiError(new Error('User data is still loading. Please try again.'));
      return;
    }
    if (!user || userError) {
      handleApiError(new Error(userError || 'User data is not available.'));
      return;
    }

    const creatableRoles = getCreatableRoles(user.role);
    if (!creatableRoles.includes(data.role as adminRoles)) {
      handleApiError(new Error('Cannot create user with a higher or equal role'));
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'role') {
          formData.append(key, value.toString());
        } else {
          formData.append(key, value as any);
        }
      }
    });

    try {
      const response = await createAdmin(formData);
      handleApiSuccess('Admin created successfully');
      handleOpenChange(false);
    } catch (error) {
      handleApiError(error);
      console.error('Error at creating admin', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) reset();
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Admin</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label>Profile Picture</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={
                        profilePicture instanceof File
                          ? URL.createObjectURL(profilePicture)
                          : undefined
                      }
                      alt="Profile preview"
                    />
                    <AvatarFallback className="text-lg">
                      {firstName && lastName ? `${firstName[0]}${lastName[0]}` : 'NA'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setValue('profile_picture', file);
                      }}
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    {...register('first_name')}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.first_name && (
                    <p className="text-sm text-red-500">{errors.first_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    {...register('last_name')}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.last_name && (
                    <p className="text-sm text-red-500">{errors.last_name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    {...register('username')}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    {...register('email')}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    {...register('phone')}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    {...register('city')}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Role & Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Role</Label>
                {isUserLoading ? (
                  <p className="text-sm text-gray-500">Loading user data...</p>
                ) : userError ? (
                  <p className="text-sm text-red-500">{userError}</p>
                ) : (
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => {
                      const creatableRoles = getCreatableRoles(user?.role);
                      if (creatableRoles.length === 0) {
                        return (
                          <p className="text-sm text-red-500">
                            You do not have permission to create admins.
                          </p>
                        );
                      }
                      return (
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) => field.onChange(value as adminRoles)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Role" />
                          </SelectTrigger>
                          <SelectContent>
                            {creatableRoles.map((role) => (
                              <SelectItem key={role} value={role.toString()}>
                                {role === adminRoles.SuperAdmin
                                  ? 'Super Admin'
                                  : role === adminRoles.SuperAdminSupporter
                                    ? 'Super Admin Supporter'
                                    : role === adminRoles.Admin
                                      ? 'Admin'
                                      : role === adminRoles.Editor
                                        ? 'Editor'
                                        : 'Viewer'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                )}
                {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Organization</CardTitle>
              <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                <p className="font-medium text-blue-800 mb-1">Admin Role Assignment:</p>
                <p className="text-blue-700">
                  If you create an admin that do not have branch it's automatically assumed to be
                  the new admin works in the main office.If you want to add an admin with branch you
                  must include the branch location.
                </p>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Controller
                  name="subcity_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Branches" />
                      </SelectTrigger>
                      <SelectContent>
                        {Subcities.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.subcity_id && (
                  <p className="text-sm text-red-500">{errors.subcity_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Controller
                  name="sector_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedSector(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sectors" />
                      </SelectTrigger>
                      <SelectContent>
                        {Sectors.map((s) => (
                          <SelectItem key={s.id} value={s.id.toString()}>
                            {s.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.sector_id && (
                  <p className="text-sm text-red-500">{errors.sector_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Controller
                  name="division_id"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedDirector(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Directors" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredDirectors.map((d) => (
                          <SelectItem key={d.id} value={d.id.toString()}>
                            {d.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.division_id && (
                  <p className="text-sm text-red-500">{errors.division_id.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Controller
                  name="department_id"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Teams" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredTeams.map((t) => (
                          <SelectItem key={t.id} value={t.id.toString()}>
                            {t.name_en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.department_id && (
                  <p className="text-sm text-red-500">{errors.department_id.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <Label>Password</Label>
              <Input
                type="password"
                {...register('password')}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUserLoading || !!userError}>
              Create Admin
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
