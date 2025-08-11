'use client';

import { useState } from 'react';
import { MoreHorizontal, ArrowUpDown, Shield, UserCog, User, Building2 } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/language-provider';

interface UserManagementTableProps {
  searchQuery: string;
  roleFilter: string;
  statusFilter: string;
}

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  region: string;
  subcity: string;
  status: string;
  lastActive: string;
}

export function UserManagementTable({
  searchQuery,
  roleFilter,
  statusFilter,
}: UserManagementTableProps) {
  const { t } = useLanguage();
  const [sorting, setSorting] = useState<{
    column: string;
    direction: 'asc' | 'desc';
  }>({
    column: 'name',
    direction: 'asc',
  });
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Mock data for users
  const users: UserType[] = [
    {
      id: 'U1001',
      name: 'Abebe Kebede',
      email: 'abebe.k@example.gov.et',
      role: 'superadmin',
      region: 'All Regions',
      subcity: 'All Subcities',
      status: 'active',
      lastActive: '2023-04-15T09:30:00',
    },
    {
      id: 'U1002',
      name: 'Sara Hailu',
      email: 'sara.h@example.gov.et',
      role: 'admin',
      region: 'Addis Ababa',
      subcity: 'Bole',
      status: 'active',
      lastActive: '2023-04-14T14:45:00',
    },
    {
      id: 'U1003',
      name: 'Dawit Mengistu',
      email: 'dawit.m@example.gov.et',
      role: 'admin',
      region: 'Amhara',
      subcity: 'Bahir Dar',
      status: 'active',
      lastActive: '2023-04-13T11:20:00',
    },
    {
      id: 'U1004',
      name: 'Hiwot Tadesse',
      email: 'hiwot.t@example.gov.et',
      role: 'manager',
      region: 'Oromia',
      subcity: 'Adama',
      status: 'inactive',
      lastActive: '2023-04-10T16:15:00',
    },
    {
      id: 'U1005',
      name: 'Yonas Bekele',
      email: 'yonas.b@example.gov.et',
      role: 'staff',
      region: 'Tigray',
      subcity: 'Mekelle',
      status: 'pending',
      lastActive: '2023-04-08T10:30:00',
    },
    {
      id: 'U1006',
      name: 'Tigist Alemu',
      email: 'tigist.a@example.gov.et',
      role: 'admin',
      region: 'SNNPR',
      subcity: 'Hawassa',
      status: 'active',
      lastActive: '2023-04-12T13:45:00',
    },
    {
      id: 'U1007',
      name: 'Bereket Haile',
      email: 'bereket.h@example.gov.et',
      role: 'manager',
      region: 'Dire Dawa',
      subcity: 'Dire Dawa City',
      status: 'active',
      lastActive: '2023-04-11T09:15:00',
    },
  ];

  // Filter users based on search query, role, and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.subcity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sorting.column as keyof UserType];
    const bValue = b[sorting.column as keyof UserType];

    if (sorting.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSort = (column: string) => {
    setSorting({
      column,
      direction: sorting.column === column && sorting.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === sortedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(sortedUsers.map((user) => user.id));
    }
  };

  const handleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin':
        return <Shield className="h-4 w-4 text-purple-500" />;
      case 'admin':
        return <UserCog className="h-4 w-4 text-blue-500" />;
      case 'manager':
        return <Building2 className="h-4 w-4 text-green-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'inactive':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'pending':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedUsers.length === sortedUsers.length && sortedUsers.length > 0}
                onCheckedChange={handleSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead className="w-[80px]">{t('id')}</TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('name')}>
                {t('name')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('email')}>
                {t('email')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center cursor-pointer" onClick={() => handleSort('role')}>
                {t('role')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => handleSort('region')}
              >
                {t('region')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => handleSort('status')}
              >
                {t('status')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => handleSort('lastActive')}
              >
                {t('lastActive')}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </div>
            </TableHead>
            <TableHead className="w-[80px]">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.length > 0 ? (
            sortedUsers.map((user) => (
              <TableRow
                key={user.id}
                className={selectedUsers.includes(user.id) ? 'bg-muted/50' : ''}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleSelectUser(user.id)}
                    aria-label={`Select ${user.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <span className="capitalize">{user.role}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{user.region}</span>
                    <span className="text-xs text-muted-foreground">{user.subcity}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(user.status)}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(user.lastActive)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">{t('openMenu')}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                      <DropdownMenuItem>{t('editUser')}</DropdownMenuItem>
                      <DropdownMenuItem>{t('viewActivity')}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className={user.status === 'active' ? 'text-red-500' : 'text-green-500'}
                      >
                        {user.status === 'active' ? t('deactivateUser') : t('activateUser')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                {t('noUsersFound')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
