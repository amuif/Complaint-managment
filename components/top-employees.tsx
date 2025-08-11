'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

export function TopEmployees() {
  const employees = [
    {
      name: 'Abebe Kebede',
      department: 'Customer Relations',
      rating: 4.8,
      image: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Tigist Alemu',
      department: 'Quality Assurance',
      rating: 4.7,
      image: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Dawit Mengistu',
      department: 'Customer Relations',
      rating: 4.6,
      image: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Sara Hailu',
      department: 'Front Office',
      rating: 4.5,
      image: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Yonas Bekele',
      department: 'IT Department',
      rating: 4.4,
      image: '/placeholder.svg?height=40&width=40',
    },
  ];

  return (
    <div className="space-y-4">
      {employees.map((employee, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
        >
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={employee.image || '/placeholder.svg'} alt={employee.name} />
            <AvatarFallback>{employee.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium">{employee.name}</p>
            <p className="truncate text-xs text-muted-foreground">{employee.department}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-medium">{employee.rating}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
