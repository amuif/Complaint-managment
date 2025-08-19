'use client';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
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
import { adminRoles, type User } from '@/types/user';
import { useOrganization } from '@/hooks/use-organization';
import { useAuth } from '@/hooks/use-auth';
import { handleApiSuccess, handleApiError } from '@/lib/error-handler';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const userUpdateSchema = z.object({
  first_name: z.string().min(1, 'First name is required').nullable(),
  last_name: z.string().min(1, 'Last name is required').nullable(),
  username: z.string().min(1, 'Username is required').nullable(),
  email: z.string().email('Invalid email').nullable(),
  phone: z.string().nullable(),
  city: z.string().nullable(),
  role: z.string().nullable(),
  subcity_id: z.number().nullable(),
  sector_id: z.number().nullable(),
  division_id: z.number().nullable(),
  department_id: z.number().nullable(),
  password: z.string().optional(),
  profile_picture: z.instanceof(File).nullable(),
});

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
  console.log('Creatable roles for', roleNumber, ':', roleHierarchy.slice(index + 1));
  return roleHierarchy.slice(index + 1);
}
interface UserEditDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserEditDialog({ user, open, onOpenChange }: UserEditDialogProps) {
  const { updateAdmin } = useAuth();
  const { Sectors, Directors, Teams, Subcities } = useOrganization();
  const [creatableRoles, setCreatableRoles] = useState<adminRoles[]>([]);

  useEffect(() => {
    if (user?.role != null) {
      const create = getCreatableRoles(user.role);
      setCreatableRoles(create);
    }
    console.log(user);
  }, [user]);

  const [formState, setFormState] = useState<Partial<User>>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || null,
    role: user?.role!,
    subcity_id: user?.subcity_id || null,
    sector_id: user?.sector_id || null,
    division_id: user?.division_id || null,
    department_id: user?.department_id || null,
    password: '',
    profile_picture: user?.profile_picture,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        city: user.city || '',
        role: user.role!,
        subcity_id: user?.subcity_id || null,
        sector_id: user?.sector_id || null,
        division_id: user?.division_id || null,
        department_id: user?.department_id || null,
        password: '',
        profile_picture: user?.profile_picture,
      });
      setErrors({});
    }
  }, [user, open]);
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: ['subcity_id', 'sector_id', 'division_id', 'department_id'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!user) return;
      const validatedData = userUpdateSchema.parse(formState);
      setErrors({});

      const formData = new FormData();
      (Object.entries(validatedData) as [keyof typeof validatedData, unknown][]).forEach(
        ([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'profile_picture' && value instanceof File) {
              formData.append(key, value);
            } else {
              formData.append(key, String(value));
            }
          }
        }
      );
      formData.append('id', user?.id);

      await updateAdmin(formData);
      handleApiSuccess('Admin updated successfully');
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path.length) fieldErrors[e.path[0]] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        handleApiError('Error at updating admin');
      }
    }
  };
  useEffect(() => {
    console.log(formState);
  }, [formState]);
  useEffect(() => {
    if (!open) {
      setFormState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        username: user?.username || '',
        email: user?.email || '',
        phone: user?.phone ?? '',
        city: user?.city ?? '',
        role: user?.role!,
        subcity_id: user?.subcity_id || '',
        sector_id: user?.sector_id || '',
        division_id: user?.division_id || '',
        department_id: user?.department_id || '',
        password: '',
      });
      setErrors({});
    }
  }, [open, user]);

  return (
    user && (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                          formState.profile_picture instanceof File
                            ? URL.createObjectURL(formState.profile_picture)
                            : typeof formState.profile_picture === 'string'
                              ? formState.profile_picture
                              : undefined
                        }
                        alt="Profile preview"
                      />
                      <AvatarFallback className="text-lg">
                        {formState.first_name && formState.last_name
                          ? `${formState.first_name[0]}${formState.last_name[0]}`
                          : 'NA'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setFormState((prev) => ({ ...prev, profile_picture: file }));
                        }}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                      />
                    </div>
                    {errors.profile_picture && (
                      <p className="text-red-500 text-xs">{errors.first_name}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      value={formState.first_name}
                      onChange={handleChange}
                      className={`border px-3 py-2 text-sm ${
                        errors.first_name ? 'border-red-500' : 'border-input'
                      }`}
                    />
                    {errors.first_name && (
                      <p className="text-red-500 text-xs">{errors.first_name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      value={formState.last_name}
                      onChange={handleChange}
                      className={`border px-3 py-2 text-sm ${
                        errors.last_name ? 'border-red-500' : 'border-input'
                      }`}
                    />
                    {errors.last_name && <p className="text-red-500 text-xs">{errors.last_name}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formState.username}
                      onChange={handleChange}
                      className={`border px-3 py-2 text-sm ${
                        errors.username ? 'border-red-500' : 'border-input'
                      }`}
                    />
                    {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      type="email"
                      className={`border px-3 py-2 text-sm ${
                        errors.email ? 'border-red-500' : 'border-input'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formState.phone ?? ''}
                      onChange={handleChange}
                      className={`border px-3 py-2 text-sm ${
                        errors.phone ? 'border-red-500' : 'border-input'
                      }`}
                    />
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formState.city ?? ''}
                      onChange={handleChange}
                      className={`border px-3 py-2 text-sm ${
                        errors.city ? 'border-red-500' : 'border-input'
                      }`}
                    />
                    {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Role & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formState.role?.toString() ?? ''}
                  onValueChange={(value) => handleSelectChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={'Select Role'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SuperAdmin">Super Admin</SelectItem>
                    <SelectItem value="SuperAdminSupporter">Super Admin Supporter</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>{' '}
                {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="subcity_id">Subcity</Label>
                <Select
                  value={formState.subcity_id?.toString()}
                  onValueChange={(value) => handleSelectChange('subcity_id', value.toString())}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subcity" />
                  </SelectTrigger>
                  <SelectContent>
                    {Subcities.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subcity_id && <p className="text-red-500 text-xs">{errors.subcity_id}</p>}

                <Label htmlFor="sector_id">Sector</Label>
                <Select
                  value={formState.sector_id?.toString()}
                  onValueChange={(value) => handleSelectChange('sector_id', value.toString())}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {Sectors.map((s) => (
                      <SelectItem key={s.id} value={s.id.toString()}>
                        {s.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sector_id && <p className="text-red-500 text-xs">{errors.sector_id}</p>}

                <Label htmlFor="division_id">Division</Label>
                <Select
                  value={formState.division_id?.toString()}
                  onValueChange={(value) => handleSelectChange('division_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Division" />
                  </SelectTrigger>
                  <SelectContent>
                    {Directors.map((d) => (
                      <SelectItem key={d.id} value={d.id.toString()}>
                        {d.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.division_id && <p className="text-red-500 text-xs">{errors.division_id}</p>}

                <Label htmlFor="department_id">Team</Label>
                <Select
                  value={formState.department_id?.toString()}
                  onValueChange={(value) => handleSelectChange('department_id', value.toString())}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Team" />
                  </SelectTrigger>
                  <SelectContent>
                    {Teams.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.name_en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department_id && (
                  <p className="text-red-500 text-xs">{errors.department_id}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                  className={`border px-3 py-2 text-sm ${
                    errors.password ? 'border-red-500' : 'border-input'
                  }`}
                />
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  );
}
