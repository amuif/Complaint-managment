'use client';

import { Badge } from '@/components/ui/badge';
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
import { MoreHorizontal, Star } from 'lucide-react';

// Mock data - would be replaced with API data
const services = [
  {
    id: 1,
    name: 'Document Verification',
    description: 'Verification and authentication of official documents',
    department: 'Administration',
    section: 'Documentation',
    region: 'Addis Ababa',
    subcity: 'Bole',
    requirements: 'ID card, Application form',
    sla: '2 days',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Business Registration',
    description: 'Registration of new businesses and organizations',
    department: 'Business',
    section: 'Registration',
    region: 'Addis Ababa',
    subcity: 'Kirkos',
    requirements: 'Business plan, ID card, Tax clearance',
    sla: '5 days',
    rating: 4.2,
  },
  {
    id: 3,
    name: 'Tax Filing',
    description: 'Filing and processing of tax returns',
    department: 'Finance',
    section: 'Taxation',
    region: 'Amhara',
    subcity: 'Bahir Dar',
    requirements: 'Tax ID, Financial statements',
    sla: '1 day',
    rating: 4,
  },
];

interface ServiceManagementTableProps {
  searchQuery: string;
  regionFilter: string;
  departmentFilter: string;
}

export function ServiceManagementTable({
  searchQuery,
  regionFilter,
  departmentFilter,
}: ServiceManagementTableProps) {
  // Filter services based on search query and filters
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion =
      regionFilter === 'all' || service.region.toLowerCase().includes(regionFilter.toLowerCase());
    const matchesDepartment =
      departmentFilter === 'all' ||
      service.department.toLowerCase().includes(departmentFilter.toLowerCase());

    return matchesSearch && matchesRegion && matchesDepartment;
  });

  const renderRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <Star className="mr-1 h-4 w-4 text-amber-500 fill-amber-500" />
        <span>{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>SLA</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredServices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No services found.
              </TableCell>
            </TableRow>
          ) : (
            filteredServices.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.department}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {service.region}
                  </Badge>
                </TableCell>
                <TableCell>{service.sla}</TableCell>
                <TableCell>{renderRating(service.rating)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Edit service</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        Delete service
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
