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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    console.log('Input Data:', {
      employeesLength: employees?.length,
      employeesSample: employees?.slice(0, 2),
      departmentFilter,
      regionFilter,
    });

    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      console.warn('No valid employees data available:', employees);
      setError('No employee data available');
      setDepartmentData([]);
      setRegionData([]);
      setIsLoading(false);
      return;
    }

    try {
      // Process department data
      const deptCount: { [key: string]: number } = {};
      employees.forEach((emp, index) => {
        const deptName = emp?.department?.name_en ?? 'Unknown';
        const isDeptMatch =
          departmentFilter === 'all' || departmentFilter === '' || deptName === departmentFilter;
        console.log(`Employee ${index}: deptName = ${deptName}, matchesFilter = ${isDeptMatch}`);
        if (isDeptMatch) {
          deptCount[deptName] = (deptCount[deptName] || 0) + 1;
        }
      });
      const deptDataArray = Object.entries(deptCount).map(([name, employees]) => ({
        name,
        employees,
      }));
      console.log('Department Data:', deptDataArray);

      // Process region data
      const regionCount: { [key: string]: number } = {};
      employees.forEach((emp, index) => {
        const regionName = emp?.subcity?.name_en ?? 'Unknown';
        const isRegionMatch =
          regionFilter === 'all' || regionFilter === '' || regionName === regionFilter;
        console.log(
          `Employee ${index}: regionName = ${regionName}, matchesFilter = ${isRegionMatch}`
        );
        if (isRegionMatch) {
          regionCount[regionName] = (regionCount[regionName] || 0) + 1;
        }
      });
      const regionDataArray = Object.entries(regionCount).map(([name, employees]) => ({
        name,
        employees,
      }));
      console.log('Region Data:', regionDataArray);

      setDepartmentData(deptDataArray);
      setRegionData(regionDataArray);
    } catch (err) {
      console.error('Error processing employee data:', err);
      setError('Error processing employee data');
      setDepartmentData([]);
      setRegionData([]);
    } finally {
      setIsLoading(false);
    }
  }, [employees, departmentFilter, regionFilter]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('employeesByDepartment') || 'Employees by Department'}</CardTitle>
            <CardDescription>
              {t('employeesByDepartmentDesc') || 'Number of employees in each department'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {departmentData.length === 0 ? (
              <div className="text-center text-gray-500">
                {t('noDataAvailable') || 'No data available'}
              </div>
            ) : (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                  <BarChart
                    data={departmentData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    <Bar dataKey="employees" name={t('employees') || 'Employees'} fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('employeesByRegion') || 'Employees by Region'}</CardTitle>
            <CardDescription>
              {t('employeesByRegionDesc') || 'Number of employees in each region'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {regionData.length === 0 ? (
              <div className="text-center text-gray-500">
                {t('noDataAvailable') || 'No data available'}
              </div>
            ) : (
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%" minHeight={400}>
                  <BarChart data={regionData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    <Bar dataKey="employees" name={t('employees') || 'Employees'} fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
