'use client';

import { Search } from 'lucide-react';
import { EmployeeCard } from '@/components/dashboard/employee-card';
import { useLanguage } from '@/components/language-provider';
// import { useEmployees } from "@/hooks/use-employees"
import { Skeleton } from '@/components/ui/skeleton';

interface EmployeeGridProps {
  searchQuery: string;
  departmentFilter: string;
}

export function EmployeeGrid({ searchQuery, departmentFilter }: EmployeeGridProps) {
  // const { t } = useLanguage()
  // // const { employees, isLoading } = useEmployees()
  //
  // // Filter employees based on search query and department
  // // const filteredEmployees = employees.filter((employee) => {
  // //   const fullName = `${employee.first_name} ${employee.middle_name || ""} ${employee.last_name}`.toLowerCase()
  // //
  //   // const matchesSearch =
  //   //   fullName.includes(searchQuery.toLowerCase()) ||
  //   //   employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //   //   employee.department.toLowerCase().includes(searchQuery.toLowerCase())
  //   //
  //   // const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter
  //
  //   // return matchesSearch && matchesDepartment
  // })
  //
  // if (isLoading) {
  //   return (
  //     <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
  //       {Array.from({ length: 6 }).map((_, index) => (
  //         <div key={index} className="rounded-lg border p-4">
  //           <div className="flex items-center gap-4 mb-4">
  //             <Skeleton className="h-12 w-12 rounded-full" />
  //             <div className="space-y-2">
  //               <Skeleton className="h-4 w-32" />
  //               <Skeleton className="h-3 w-24" />
  //             </div>
  //           </div>
  //           <div className="space-y-2">
  //             <Skeleton className="h-3 w-full" />
  //             <Skeleton className="h-3 w-3/4" />
  //             <Skeleton className="h-3 w-1/2" />
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   )
  // }
  //
  return (
    <>
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"> */}
      {/*   {filteredEmployees.map((employee) => ( */}
      {/*     <EmployeeCard key={employee.id} employee={employee} /> */}
      {/*   ))} */}
      {/* </div> */}
      {/**/}
      {/* {filteredEmployees.length === 0 && ( */}
      {/*   <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"> */}
      {/*     <div className="rounded-full bg-muted p-3"> */}
      {/*       <Search className="h-6 w-6 text-muted-foreground" /> */}
      {/*     </div> */}
      {/*     <h3 className="mt-4 text-lg font-semibold">{t("noEmployeesFound")}</h3> */}
      {/*     <p className="mt-2 text-sm text-muted-foreground">{t("adjustFiltersEmployees")}</p> */}
      {/*   </div> */}
      {/* )} */}
    </>
  );
}
