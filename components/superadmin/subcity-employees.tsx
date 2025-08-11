'use client';

import { useSubcityEmployees } from '@/hooks/use-subcity';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, Building, MapPin } from 'lucide-react';

interface SubcityEmployeesProps {
  subcity: string;
}

export function SubcityEmployees({ subcity }: SubcityEmployeesProps) {
  // Convert formatted subcity back to database format
  // For "Bole Sub City" -> "Bole", "Arada Sub City" -> "Arada", etc.
  const subcityName = subcity.split(' ')[0];
  const { employees, isLoading, isError } = useSubcityEmployees(subcityName);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Employees</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                    <div className="space-y-1">
                      <div className="h-4 bg-muted rounded w-20"></div>
                      <div className="h-3 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-3 bg-muted rounded w-full mb-1"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Employees</h3>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">Unable to load employee data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Employees</h3>
        <Badge variant="secondary">
          <Users className="w-3 h-3 mr-1" />
          {employees.length} employees
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employees.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">No employees found for {subcity}</p>
            </CardContent>
          </Card>
        ) : (
          employees.map((employee) => (
            <Card key={employee.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarFallback>
                      {employee.first_name?.[0]}
                      {employee.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-sm">
                      {employee.first_name} {employee.last_name}
                    </h4>
                    <p className="text-xs text-muted-foreground">{employee.position}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-3 w-3" />
                    <span>{employee.department}</span>
                  </div>

                  {employee.office_number && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>
                        Office {employee.office_number}, Floor {employee.floor_number}
                      </span>
                    </div>
                  )}

                  {employee.section && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {employee.section}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
