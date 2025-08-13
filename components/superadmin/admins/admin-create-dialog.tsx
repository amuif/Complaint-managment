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
import { adminRoles } from '@/types/user';

interface UserCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserCreateDialog({ open, onOpenChange,}: UserCreateDialogProps) {
  const [isActive, setIsActive] = useState(true);
  const [role, setRole] = useState(adminRoles.Viewer.toString());

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Add the switch and select values that aren't automatically included
    formData.set('is_active', isActive.toString());
    formData.set('role', role);

  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setIsActive(true);
      setRole(adminRoles.Viewer.toString());
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Admin</DialogTitle>
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
                  <Label htmlFor="create_first_name">First Name</Label>
                  <Input id="create_first_name" name="first_name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create_last_name">Last Name</Label>
                  <Input id="create_last_name" name="last_name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create_username">Username</Label>
                  <Input id="create_username" name="username" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create_email">Email</Label>
                  <Input id="create_email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create_phone">Phone</Label>
                  <Input id="create_phone" name="phone" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create_city">City</Label>
                  <Input id="create_city" name="city" />
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
                  <Label htmlFor="create_role">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={adminRoles.SuperAdmin.toString()}>Super Admin</SelectItem>
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
                  <Label htmlFor="create_is_active">Account Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="create_is_active"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                    <Label htmlFor="create_is_active" className="text-sm">
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
                  <Label htmlFor="create_subcity_id">Subcity ID</Label>
                  <Input id="create_subcity_id" name="subcity_id" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create_department_id">Department ID</Label>
                  <Input id="create_department_id" name="department_id" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create_sector_id">Sector ID</Label>
                  <Input id="create_sector_id" name="sector_id" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create_division_id">Division ID</Label>
                  <Input id="create_division_id" name="division_id" type="number" />
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
                <Label htmlFor="create_password">Password</Label>
                <Input
                  id="create_password"
                  name="password"
                  type="password"
                  required
                  placeholder="Enter password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create_failed_login_attempts">Failed Login Attempts</Label>
                <Input
                  id="create_failed_login_attempts"
                  name="failed_login_attempts"
                  type="number"
                  defaultValue="0"
                  min="0"
                />
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Admin</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
