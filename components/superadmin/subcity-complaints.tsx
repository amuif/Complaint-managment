'use client';

import { useSubcityComplaints } from '@/hooks/use-subcity';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { CheckCircle, Clock, AlertCircle, XCircle, MessageSquare, User } from 'lucide-react';

interface SubcityComplaintsProps {
  subcity: string;
}

export function SubcityComplaints({ subcity }: SubcityComplaintsProps) {
  // Convert formatted subcity back to database format
  // For "Bole Sub City" -> "Bole", "Arada Sub City" -> "Arada", etc.
  const subcityName = subcity.split(' ')[0];
  const { complaints, publicComplaints, isLoading, isError } = useSubcityComplaints(subcityName);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Complaints</h3>
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
        <h3 className="text-lg font-semibold">Complaints</h3>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">Unable to load complaints data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Combine both complaint sources
  const allComplaints = [
    ...(Array.isArray(complaints) ? complaints : []),
    ...(Array.isArray(publicComplaints) ? publicComplaints : []),
  ];

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'in_progress':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant =
      status?.toLowerCase() === 'resolved'
        ? 'default'
        : status?.toLowerCase() === 'pending'
          ? 'secondary'
          : status?.toLowerCase() === 'in_progress'
            ? 'outline'
            : 'destructive';

    return (
      <Badge variant={variant} className="text-xs">
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Complaints</h3>
        <Badge variant="secondary">
          <MessageSquare className="w-3 h-3 mr-1" />
          {allComplaints.length} complaints
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allComplaints.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">No complaints found for {subcity}</p>
            </CardContent>
          </Card>
        ) : (
          allComplaints.slice(0, 6).map((complaint) => (
            <Card key={complaint.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(complaint.status)}
                      <span className="text-sm font-medium">#{complaint.tracking_code}</span>
                    </div>
                    {getStatusBadge(complaint.status)}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {complaint.description}
                  </p>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div>Department: {complaint.department}</div>
                    {complaint.Employee && (
                      <div>
                        Employee: {complaint.Employee.first_name} {complaint.Employee.last_name}
                      </div>
                    )}
                    <div>Date: {format(parseISO(complaint.created_at), 'MMM dd, yyyy')}</div>
                  </div>

                  {complaint.response && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-green-700 bg-green-50 p-2 rounded">
                        Response: {complaint.response}
                      </p>
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
