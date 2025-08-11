'use client';
import type React from 'react';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2, Loader2, AlertTriangle } from 'lucide-react';
import type { Employee } from '@/types/employee';
import { useLanguage } from '@/components/language-provider';
import { useEmployees } from '@/hooks/use-employees';
import { handleApiError, handleApiSuccess } from '@/lib/error-handler';

interface DeleteEmployeeProps {
  employee: Employee;
  children: React.ReactNode;
  onDelete?: (employeeId: number) => void;
}

export function DeleteEmployee({ employee, children, onDelete }: DeleteEmployeeProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { deleteEmployee } = useEmployees();

  const employeeName =
    `${employee.first_name_en} ${employee.middle_name_en || ''} ${employee.last_name_en}`.trim();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      if (onDelete) {
        const response = await deleteEmployee(employee.id);
        handleApiSuccess(response.message);
        setOpen(false);
      }
    } catch (error) {
      handleApiError(t('failedToDeleteEmployee') || 'Failed to delete employee');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {'Delete Employee'}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                {'Are you sure you want to delete this employee? This action cannot be undone.'}
              </p>

              {/* Employee Preview */}
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={employee.profile_picture || '/placeholder.svg?height=40&width=40'}
                    alt={employeeName}
                  />
                  <AvatarFallback>
                    {employee.first_name_en?.charAt(0) || 'E'}
                    {employee.last_name_en?.charAt(0) || ''}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{employeeName}</div>
                  <div className="text-sm text-muted-foreground">
                    {employee.position_en} • {employee.department.name_en}
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <strong>{t('warning') || 'Warning'}:</strong>{' '}
                {
                  'This will permanently remove all employee data, including their profile, work history, and associated records.'
                }
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{t('cancel') || 'Cancel'}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Trash2 className="h-4 w-4 mr-2" />
            {'Delete Employee'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
