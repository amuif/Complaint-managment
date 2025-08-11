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

// Mock data - would be replaced with API data
const departmentData = [
  { name: 'HR', employees: 42, rating: 4.2 },
  { name: 'Finance', employees: 38, rating: 4.5 },
  { name: 'Operations', employees: 65, rating: 4.1 },
  { name: 'IT', employees: 27, rating: 4.7 },
  { name: 'Customer Service', employees: 63, rating: 4.3 },
  { name: 'Administration', employees: 48, rating: 4.0 },
  { name: 'Legal', employees: 22, rating: 4.4 },
  { name: 'Communications', employees: 18, rating: 4.6 },
  { name: 'Regional Affairs', employees: 35, rating: 4.2 },
];

const regionData = [
  { name: 'Addis Ababa', employees: 120, rating: 4.4 },
  { name: 'Amhara', employees: 85, rating: 4.2 },
  { name: 'Oromia', employees: 95, rating: 4.3 },
  { name: 'Tigray', employees: 45, rating: 4.1 },
  { name: 'SNNPR', employees: 65, rating: 4.5 },
  { name: 'Sidama', employees: 35, rating: 4.2 },
  { name: 'Somali', employees: 30, rating: 4.0 },
  { name: 'Afar', employees: 25, rating: 3.9 },
  { name: 'Gambella', employees: 20, rating: 4.0 },
  { name: 'Benishangul-Gumuz', employees: 28, rating: 4.1 },
  { name: 'Harari', employees: 18, rating: 4.3 },
  { name: 'Dire Dawa', employees: 22, rating: 4.4 },
];

const ratingDistribution = [
  { rating: '5 Stars', count: 120 },
  { rating: '4 Stars', count: 230 },
  { rating: '3 Stars', count: 85 },
  { rating: '2 Stars', count: 25 },
  { rating: '1 Star', count: 10 },
];

interface EmployeeAnalyticsProps {
  regionFilter: string;
  departmentFilter: string;
}

export function EmployeeAnalytics({ regionFilter, departmentFilter }: EmployeeAnalyticsProps) {
  const { t } = useLanguage();

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

      <Card>
        <CardHeader>
          <CardTitle>{t('employeeRatingDistribution')}</CardTitle>
          <CardDescription>{t('employeeRatingDistributionDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name={t('employees')} fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
