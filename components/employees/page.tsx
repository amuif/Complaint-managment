'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Download, Edit, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/components/language-provider';
import { useAuth } from '@/hooks/use-auth';
import { Loader } from '@/components/ui/loader';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

interface Employee {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  position: string;
  department: string;
  office_number?: string;
  floor_number?: number;
  city?: string;
  subcity?: string;
  profile_picture?: string;
  created_at: string;
  section?: string;
}

export default function EmployeesPage() {
  const { t } = useLanguage();
  const { user, token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [subcityFilter, setSubcityFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Fetch employees with role-based filtering
  const {
    data: employees,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['employees', departmentFilter, subcityFilter],
    queryFn: async () => {
      console.log('Fetching employees with token:', token ? 'Token exists' : 'No token');
      console.log('API URL:', `${API_BASE_URL}/admin/employees`);

      const params = new URLSearchParams();
      if (departmentFilter !== 'all') params.append('department', departmentFilter);
      if (subcityFilter !== 'all') params.append('subcity', subcityFilter);

      const response = await fetch(`${API_BASE_URL}/admin/employees?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch employees: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data || [];
    },
    enabled: !!token,
  });

  // Delete employee mutation
  const deleteEmployeeMutation = useMutation({
    mutationFn: async (employeeId: number) => {
      const response = await fetch(`${API_BASE_URL}/admin/employees/${employeeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: t('success'),
        description: 'Employee deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Filter employees based on search query
  const filteredEmployees =
    employees?.filter((employee: Employee) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        employee.first_name.toLowerCase().includes(searchLower) ||
        employee.last_name.toLowerCase().includes(searchLower) ||
        employee.position.toLowerCase().includes(searchLower) ||
        employee.department.toLowerCase().includes(searchLower)
      );
    }) || [];

  const handleDeleteEmployee = (employee: Employee) => {
    if (confirm(`Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`)) {
      deleteEmployeeMutation.mutate(employee.id);
    }
  };

  const getEmployeeInitials = (employee: Employee) => {
    return `${employee.first_name[0]}${employee.last_name[0]}`.toUpperCase();
  };

  const getDepartmentBadgeColor = (department: string) => {
    switch (department) {
      case 'Control and Awareness Department':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Engineering Department':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Support Administration Department':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Control Center Department':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    }
  };

  const canManageEmployees = user?.role === 'SuperAdmin' || user?.role === 'SubCityAdmin';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t('allEmployees')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view all employees in the system
          </p>
        </div>
        {canManageEmployees && (
          <Button className="w-full md:w-auto" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('addEmployee')}
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={t('search')}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            <SelectItem value="Control and Awareness Department">Control & Awareness</SelectItem>
            <SelectItem value="Engineering Department">Engineering</SelectItem>
            <SelectItem value="Support Administration Department">
              Support Administration
            </SelectItem>
            <SelectItem value="Control Center Department">Control Center</SelectItem>
          </SelectContent>
        </Select>
        <Select value={subcityFilter} onValueChange={setSubcityFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filter by subcity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subcities</SelectItem>
            <SelectItem value="Arada">Arada</SelectItem>
            <SelectItem value="Kirkos">Kirkos</SelectItem>
            <SelectItem value="Lideta">Lideta</SelectItem>
            <SelectItem value="Bole">Bole</SelectItem>
            <SelectItem value="Yeka">Yeka</SelectItem>
            <SelectItem value="Addis Ketema">Addis Ketema</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>A comprehensive list of all employees in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader size="md" text="Loading employees..." />
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-8">
              Failed to load employees. Please try again.
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center text-gray-500 p-8">
              No employees found matching your criteria.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Office</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee: Employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={employee.profile_picture}
                            alt={`${employee.first_name} ${employee.last_name}`}
                          />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {getEmployeeInitials(employee)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {employee.first_name} {employee.middle_name} {employee.last_name}
                          </div>
                          <div className="text-sm text-gray-500">ID: {employee.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{employee.position}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDepartmentBadgeColor(employee.department)}>
                        {employee.department}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {employee.subcity && <div>{employee.subcity}</div>}
                        <div className="text-gray-500">{employee.city || 'Addis Ababa'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {employee.office_number && <div>Office: {employee.office_number}</div>}
                        {employee.floor_number && (
                          <div className="text-gray-500">Floor: {employee.floor_number}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {canManageEmployees && (
                            <>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedEmployee(employee);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteEmployee(employee)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Employee Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>Detailed information about the selected employee</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={selectedEmployee.profile_picture}
                    alt={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
                  />
                  <AvatarFallback className="bg-blue-600 text-white text-lg">
                    {getEmployeeInitials(selectedEmployee)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedEmployee.first_name} {selectedEmployee.middle_name}{' '}
                    {selectedEmployee.last_name}
                  </h3>
                  <p className="text-gray-600">{selectedEmployee.position}</p>
                  <Badge className={getDepartmentBadgeColor(selectedEmployee.department)}>
                    {selectedEmployee.department}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Employee ID</label>
                  <p>{selectedEmployee.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p>{selectedEmployee.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">City</label>
                  <p>{selectedEmployee.city || 'Addis Ababa'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Subcity</label>
                  <p>{selectedEmployee.subcity || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Office Number</label>
                  <p>{selectedEmployee.office_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Floor Number</label>
                  <p>{selectedEmployee.floor_number || 'N/A'}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>Add a new employee to the system</DialogDescription>
          </DialogHeader>
          <AddEmployeeForm
            onSuccess={() => {
              setIsAddDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ['employees'] });
              toast({
                title: 'Success',
                description: 'Employee added successfully',
              });
            }}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update employee information</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <EditEmployeeForm
              employee={selectedEmployee}
              onSuccess={() => {
                setIsEditDialogOpen(false);
                setSelectedEmployee(null);
                queryClient.invalidateQueries({ queryKey: ['employees'] });
                toast({
                  title: 'Success',
                  description: 'Employee updated successfully',
                });
              }}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedEmployee(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Add Employee Form Component
function AddEmployeeForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch(`${API_BASE_URL}/admin/employees`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add employee');
      }

      onSuccess();
    } catch (error) {
      console.error('Error adding employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">First Name</label>
          <Input name="first_name" required />
        </div>
        <div>
          <label className="text-sm font-medium">Last Name</label>
          <Input name="last_name" required />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Middle Name</label>
        <Input name="middle_name" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Position</label>
          <Input name="position" />
        </div>
        <div>
          <label className="text-sm font-medium">Department</label>
          <Select name="department">
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Control and Awareness Department">Control & Awareness</SelectItem>
              <SelectItem value="Engineering Department">Engineering</SelectItem>
              <SelectItem value="Support Administration Department">
                Support Administration
              </SelectItem>
              <SelectItem value="Control Center Department">Control Center</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Office Number</label>
          <Input name="office_number" />
        </div>
        <div>
          <label className="text-sm font-medium">Floor Number</label>
          <Input name="floor_number" type="number" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">City</label>
          <Input name="city" defaultValue="Addis Ababa" />
        </div>
        <div>
          <label className="text-sm font-medium">Subcity</label>
          <Select name="subcity">
            <SelectTrigger>
              <SelectValue placeholder="Select subcity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arada">Arada</SelectItem>
              <SelectItem value="Kirkos">Kirkos</SelectItem>
              <SelectItem value="Lideta">Lideta</SelectItem>
              <SelectItem value="Bole">Bole</SelectItem>
              <SelectItem value="Yeka">Yeka</SelectItem>
              <SelectItem value="Addis Ketema">Addis Ketema</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Profile Picture</label>
        <Input name="profile_picture" type="file" accept="image/*" />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Employee'}
        </Button>
      </div>
    </form>
  );
}

// Edit Employee Form Component
function EditEmployeeForm({
  employee,
  onSuccess,
  onCancel,
}: {
  employee: Employee;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch(`${API_BASE_URL}/admin/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update employee');
      }

      onSuccess();
    } catch (error) {
      console.error('Error updating employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">First Name</label>
          <Input name="first_name" defaultValue={employee.first_name} required />
        </div>
        <div>
          <label className="text-sm font-medium">Last Name</label>
          <Input name="last_name" defaultValue={employee.last_name} required />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Middle Name</label>
        <Input name="middle_name" defaultValue={employee.middle_name || ''} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Position</label>
          <Input name="position" defaultValue={employee.position} />
        </div>
        <div>
          <label className="text-sm font-medium">Department</label>
          <Input name="department" defaultValue={employee.department} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Office Number</label>
          <Input name="office_number" defaultValue={employee.office_number || ''} />
        </div>
        <div>
          <label className="text-sm font-medium">Floor Number</label>
          <Input name="floor_number" type="number" defaultValue={employee.floor_number || ''} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">City</label>
          <Input name="city" defaultValue={employee.city || 'Addis Ababa'} />
        </div>
        <div>
          <label className="text-sm font-medium">Subcity</label>
          <Input name="subcity" defaultValue={employee.subcity || ''} />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Profile Picture</label>
        <Input name="profile_picture" type="file" accept="image/*" />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Employee'}
        </Button>
      </div>
    </form>
  );
}
