'use client';

import { useRatings } from '@/hooks/use-ratings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface RatingsChartProps {
  dateRange: DateRange | undefined;
}
export function RatingsChart({ dateRange }: RatingsChartProps) {
  const { ratings, publicRatings, isLoading, isError } = useRatings();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Rating Distribution
          </CardTitle>
          <CardDescription>Distribution of ratings across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading chart...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Rating Distribution
          </CardTitle>
          <CardDescription>Distribution of ratings across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">Unable to load chart data</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Combine both rating sources
  const allRatings = [...(ratings || []), ...(publicRatings || [])];

  if (allRatings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Rating Distribution
          </CardTitle>
          <CardDescription>Distribution of ratings across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground">No rating data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate averages for each category
  const calculateAverage = (category: 'courtesy' | 'punctuality' | 'knowledge') => {
    const sum = allRatings.reduce((acc, rating) => acc + (rating[category] || 0), 0);
    return Number((sum / allRatings.length).toFixed(1));
  };

  // Prepare chart data
  const chartData = [
    {
      category: 'Courtesy',
      average: calculateAverage('courtesy'),
      count: allRatings.filter((r) => r.courtesy).length,
    },
    {
      category: 'Punctuality',
      average: calculateAverage('punctuality'),
      count: allRatings.filter((r) => r.punctuality).length,
    },
    {
      category: 'Knowledge',
      average: calculateAverage('knowledge'),
      count: allRatings.filter((r) => r.knowledge).length,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary">Average: {payload[0].value}/5</p>
          <p className="text-muted-foreground text-sm">
            Based on {payload[0].payload.count} ratings
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Rating Distribution
        </CardTitle>
        <CardDescription>
          Average ratings across different service categories ({allRatings.length} total ratings)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="average" className="fill-primary" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
          {chartData.map((item) => (
            <div key={item.category} className="text-center">
              <div className="text-2xl font-bold text-primary">{item.average}</div>
              <div className="text-xs text-muted-foreground">{item.category}</div>
              <div className="text-xs text-muted-foreground">({item.count} ratings)</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
