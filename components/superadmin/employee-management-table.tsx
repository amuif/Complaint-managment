'use client';

import { useEffect, useState } from 'react';
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
  Mail,
  Phone,
  Building,
  MapPin,
  Loader2,
} from 'lucide-react';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/language-provider';
import { Card, CardContent } from '@/components/ui/card';
import { useEmployees } from '@/hooks/use-employees';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Employee } from '@/types/employee';
import { DeleteEmployee } from './delete-employee';
import { ViewEmployeeDetails } from './view-employee-details';
import { EditEmployee } from './edit-emlooyee';
import { PICTURE_URL } from '@/constants/base_url';

interface EmployeeManagementTableProps {
  searchQuery: string;
  regionFilter: string;
  departmentFilter: string;
}

export function EmployeeManagementTable({
  searchQuery,
  regionFilter,
  departmentFilter,
}: EmployeeManagementTableProps) {
  const { t } = useLanguage();
  const { employees, isLoading, isError, error, updateEmployee } = useEmployees();
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  useEffect(() => {
    console.log('employees', employees);
  }, [employees]);

  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const handleEmployeeDelete = (employeeId: string) => {
    console.log('Deleting employee:', employeeId);
  };
  // Handle loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">{t('loadingEmployees') || 'Loading employees...'}</span>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertDescription>
              {error?.message || t('failedToLoadEmployees') || 'Failed to load employees'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Filter employees based on search query and filters
  const filteredEmployees = employees.filter((employee: Employee) => {
    const employeeName = `${employee.first_name_en} ${
      employee.middle_name_en || ''
    } ${employee.last_name_en}`.trim();
    const matchesSearch =
      employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.name_en.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion =
      regionFilter === 'all' ||
      (employee.city && employee.city.toLowerCase().replace(/\s+/g, '-') === regionFilter);
    const matchesDepartment =
      departmentFilter === 'all' ||
      employee.department.name_en.toLowerCase().replace(/\s+/g, '-') === departmentFilter;

    return matchesSearch && matchesRegion && matchesDepartment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees: Employee[] = filteredEmployees.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('employee') || 'Employee'}</TableHead>
                <TableHead>{t('contact') || 'Contact'}</TableHead>
                <TableHead>{t('location') || 'Location'}</TableHead>
                <TableHead className="text-right">{t('actions') || 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEmployees.length === 0 ? (
                <>
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {t('noEmployeesFound') || 'No employees found'}
                    </TableCell>
                  </TableRow>
                </>
              ) : (
                paginatedEmployees.map((employee) => {
                  const employeeName = `${employee.first_name_en} ${
                    employee.middle_name_en || ''
                  } ${employee.last_name_en}`.trim();
                  const profilePictureUrl = employee.profile_picture || '/placeholder.svg';
                  return (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-2">
                            <div>
                              <Avatar className="h-10 w-10">
                                <AvatarImage
                                  src={
                                    profilePictureFile
                                      ? URL.createObjectURL(profilePictureFile)
                                      : employee.profile_picture
                                        ? `${PICTURE_URL}${employee.profile_picture}`
                                        : '/placeholder.svg?height=160&width=160'
                                  }
                                  alt={employeeName}
                                  className="h-full w-full object-cover"
                                />
                                <AvatarFallback className="text-base">
                                  {employee.first_name_en?.charAt(0) ?? 'E'}
                                  {employee.last_name_en?.charAt(0) ?? ''}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div>
                              <div className="font-medium">{employeeName}</div>
                              <div className="text-sm text-muted-foreground">
                                {employee.position_en}
                              </div>
                            </div>{' '}
                            <Badge variant="outline" className="mt-1"></Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-sm">
                            <Mail className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            {`${employee?.first_name_en?.toLowerCase()}.${employee?.last_name_en?.toLowerCase()}@office.gov.et` ||
                              'Email is not set'}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            {employee.phone || 'Phone not set'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-sm">
                            <MapPin className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            {employee.city || 'Addis Ababa'}, {employee.section}
                          </div>
                          <div className="flex items-center text-sm">
                            <Building className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                            {t('office') || 'Office'} {employee.office_number},{' '}
                            {t('floor') || 'Floor'} {employee.floor_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">{t('openMenu') || 'Open menu'}</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>{t('actions') || 'Actions'}</DropdownMenuLabel>
                            <ViewEmployeeDetails employee={employee}>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Eye className="mr-2 h-4 w-4" />
                                {t('viewDetails') || 'View Details'}
                              </DropdownMenuItem>
                            </ViewEmployeeDetails>
                            <EditEmployee employee={employee}>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t('editEmployee') || 'Edit Employee'}
                              </DropdownMenuItem>
                            </EditEmployee>
                            <DropdownMenuSeparator />
                            <DeleteEmployee
                              employee={employee}
                              onDelete={() => handleEmployeeDelete}
                            >
                              <DropdownMenuItem
                                className="text-destructive"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {'Delete Employee'}
                              </DropdownMenuItem>
                            </DeleteEmployee>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page > 1 ? page - 1 : 1)}
              disabled={page === 1}
            >
              {t('previous') || 'Previous'}
            </Button>
            <div className="text-sm">
              {t('page') || 'Page'} {page} {t('of') || 'of'} {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page < totalPages ? page + 1 : totalPages)}
              disabled={page === totalPages}
            >
              {t('next') || 'Next'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
