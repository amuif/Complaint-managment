'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/components/language-provider';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useEmployees } from '@/hooks/use-employees';
import { useEffect, useState } from 'react';

interface EmployeeAnalyticsProps {
  regionFilter: string;
  departmentFilter: string;
}

export function EmployeeAnalytics({ regionFilter, departmentFilter }: EmployeeAnalyticsProps) {
  const { t } = useLanguage();
  const { employees } = useEmployees();

  const [departmentData, setDepartmentData] = useState<{ name: string; employees: number }[]>([]);
  const [regionData, setRegionData] = useState<{ name: string; employees: number }[]>([]);

  useEffect(() => {
    console.log('Employees:', employees);
    console.log('Filters:', { departmentFilter, regionFilter });

    if (!employees || employees.length === 0) {
      console.log('No employees data available');
      return;
    }

    const deptCount = {};
    employees.forEach((emp) => {
      const deptName = emp.department?.name_en || 'Unknown';
      if (!departmentFilter || deptName === departmentFilter) {
        deptCount[deptName] = (deptCount[deptName] || 0) + 1;
      }
    });
    const deptDataArray = Object.entries(deptCount).map(([name, count]) => ({
      name,
      employees: count,
    }));
    console.log('deptCount:', deptCount);
    console.log('deptDataArray:', deptDataArray);

    const regionCount = {};
    employees.forEach((emp) => {
      const regionName = emp.subcity?.name_en || 'Unknown';
      if (!regionFilter || regionName === regionFilter) {
        regionCount[regionName] = (regionCount[regionName] || 0) + 1;
      }
    });
    const regionDataArray = Object.entries(regionCount).map(([name, count]) => ({
      name,
      employees: count,
    }));
    console.log('regionCount:', regionCount);
    console.log('regionDataArray:', regionDataArray);

    setDepartmentData(deptDataArray);
    setRegionData(regionDataArray);
  }, [employees, departmentFilter, regionFilter]);
  useEffect(() => {
    console.log(employees);
  }, [employees]);

  useEffect(() => {
    console.log(departmentData);
    console.log(regionData);
  }, [departmentData, regionData]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('employeesByDepartment')}</CardTitle>
            <CardDescription>{t('employeesByDepartmentDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="employees" name={t('employees')} fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('employeesByRegion')}</CardTitle>
            <CardDescription>{t('employeesByRegionDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="employees" name={t('employees')} fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
