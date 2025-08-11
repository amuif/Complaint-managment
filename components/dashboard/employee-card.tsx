'use client';

import Image from 'next/image';
import { Mail, MoreHorizontal, Phone, Star } from 'lucide-react';
import type { Employee } from '@/types/employee';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface EmployeeCardProps {
  employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <Card key={employee.id} className="overflow-hidden">
      <CardHeader className="relative p-0">
        <div className="h-32 w-full bg-gradient-to-r from-primary/20 to-primary/5"></div>
        <div className="absolute -bottom-12 left-4">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-background">
            <Image
              src={employee.image || '/placeholder.svg?height=96&width=96'}
              alt={employee.name}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="absolute right-4 top-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/50 backdrop-blur-sm"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Edit Details</DropdownMenuItem>
              <DropdownMenuItem>Assign Tasks</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-14">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{employee.name}</h3>
            <p className="text-sm text-muted-foreground">{employee.role}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className="text-xs font-medium">{employee.rating}</span>
          </div>
        </div>
        <Badge variant="secondary" className="mt-2">
          {employee.department}
        </Badge>
        <p className="mt-4 text-sm text-muted-foreground line-clamp-2">{employee.bio}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-4">
        <Button variant="ghost" size="sm" className="gap-1">
          <Mail className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:inline-block">Email</span>
        </Button>
        <Button variant="ghost" size="sm" className="gap-1">
          <Phone className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:inline-block">Call</span>
        </Button>
        <Button variant="outline" size="sm">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
