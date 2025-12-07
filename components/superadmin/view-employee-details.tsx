'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Mail, Phone, Building, MapPin, Calendar, User, Star } from 'lucide-react';
import type { Employee } from '@/types/employee';
import { useLanguage } from '@/components/language-provider';
import { PICTURE_URL } from '@/constants/base_url';

interface ViewEmployeeDetailsProps {
  employee: Employee;
  children: React.ReactNode;
}

export function ViewEmployeeDetails({ employee, children }: ViewEmployeeDetailsProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const employeeName =
    `${employee?.first_name_en} ${employee?.middle_name_en || ''} ${employee?.last_name_en}`.trim();

  const profilePictureUrl = employee.profile_picture || '/placeholder.svg?height=120&width=120';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {t('employeeDetails') || 'Employee Details'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={`${PICTURE_URL}${profilePictureUrl}` || '/placeholder.svg'}
                    alt={employeeName}
                  />
                  <AvatarFallback className="text-lg">
                    {employee?.first_name_en?.charAt(0) || 'E'}
                    {employee?.last_name_en?.charAt(0) || ''}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{employeeName}</h3>
                  <p className="text-muted-foreground">{employee?.position_en}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{employee?.department?.name_en}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {'Contact Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{`${employee.email} ` || 'Email not set'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{employee.phone || 'Phone not set'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {'Location Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>
                  {'Office'} {employee.office_number}, {t('floor') || 'Floor'}{' '}
                  {employee.floor_number}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {'Additional Information'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {'Joined on'}: {new Date(employee.created_at).toLocaleDateString()}
                </span>
              </div>
              {employee.subcity && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {'Subcity'}: {employee.subcity.name_en}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
