'use client';

import { useServices } from '@/hooks/use-services';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Clock } from 'lucide-react';

interface SubcityServicesProps {
  subcity: string;
}

export function SubcityServices({ subcity }: SubcityServicesProps) {
  const { departments, isLoading, isError } = useServices();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Services</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
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
        <h3 className="text-lg font-semibold">Services</h3>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">Unable to load services data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter departments that could be relevant to the subcity
  const relevantDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(subcity.toLowerCase()) ||
      subcity.toLowerCase().includes(dept.name.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Departments</h3>
        <Badge variant="secondary">{relevantDepartments.length} departments</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {relevantDepartments.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                No departments found for {subcity}
              </p>
            </CardContent>
          </Card>
        ) : (
          relevantDepartments.map((dept) => (
            <Card key={dept.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <CardTitle className="text-sm font-medium">{dept.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>Code: {dept.code}</span>
                  </div>
                  {dept.description && (
                    <p className="text-xs text-muted-foreground">{dept.description}</p>
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
