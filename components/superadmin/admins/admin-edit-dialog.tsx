'use client';

import type React from 'react';

import { useState } from 'react';
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminRoles, User } from '@/types/user';

interface UserEditDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserEditDialog({ user, open, onOpenChange }: UserEditDialogProps) {
  const [isActive, setIsActive] = useState(user?.is_active);
  const [role, setRole] = useState(user?.role.toString());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {};

  return (
    user && (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      defaultValue={user.first_name}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" name="last_name" defaultValue={user.last_name} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" defaultValue={user.username} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={user.email}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" defaultValue={user.phone || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" defaultValue={user.city || ''} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Role & Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Role & Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={adminRoles.SuperAdmin.toString()}>
                          Super Admin
                        </SelectItem>
                        <SelectItem value={adminRoles.SuperAdminSupporter.toString()}>
                          Super Admin Supporter
                        </SelectItem>
                        <SelectItem value={adminRoles.Admin.toString()}>Admin</SelectItem>
                        <SelectItem value={adminRoles.Editor.toString()}>Editor</SelectItem>
                        <SelectItem value={adminRoles.Viewer.toString()}>Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="is_active">Account Status</Label>
                    <div className="flex items-center space-x-2">
                      <Switch id="is_active" checked={isActive} onCheckedChange={setIsActive} />
                      <Label htmlFor="is_active" className="text-sm">
                        {isActive ? 'Active' : 'Inactive'}
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Organization Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subcity_id">Subcity ID</Label>
                    <Input
                      id="subcity_id"
                      name="subcity_id"
                      type="number"
                      defaultValue={user.subcity_id || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department_id">Department ID</Label>
                    <Input
                      id="department_id"
                      name="department_id"
                      type="number"
                      defaultValue={user.department_id || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sector_id">Sector ID</Label>
                    <Input
                      id="sector_id"
                      name="sector_id"
                      type="number"
                      defaultValue={user.sector_id || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="division_id">Division ID</Label>
                    <Input
                      id="division_id"
                      name="division_id"
                      type="number"
                      defaultValue={user.division_id || ''}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password (leave blank to keep current)</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter new password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="failed_login_attempts">Failed Login Attempts</Label>
                  <Input
                    id="failed_login_attempts"
                    name="failed_login_attempts"
                    type="number"
                    defaultValue={user.failed_login_attempts}
                    min="0"
                  />
                </div>
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
