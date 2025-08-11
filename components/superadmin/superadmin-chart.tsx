'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/components/language-provider';
import { useComplaints } from '@/hooks/use-complaints';
import { useFeedback } from '@/hooks/use-feedback';
import { useRatings } from '@/hooks/use-ratings';
// import { useEmployees } from "@/hooks/use-employees";
import { format, parseISO, subDays, subMonths, subYears, isWithinInterval } from 'date-fns';

interface SuperAdminChartProps {
  timeRange: string;
}

export function SuperAdminChart({ timeRange }: SuperAdminChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const { t } = useLanguage();

  // Get real data from hooks
  const { complaints, publicComplaints } = useComplaints();
  const { feedback, publicFeedback } = useFeedback();
  const { ratings, publicRatings } = useRatings();
  // const { employees } = useEmployees();

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Colors based on theme
    const isDark = theme === 'dark';
    const textColor = isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    // Define colors for different data series
    const colors = {
      complaints: {
        line: 'rgba(239, 68, 68, 0.8)',
        fill: 'rgba(239, 68, 68, 0.1)',
      },
      feedback: {
        line: 'rgba(34, 197, 94, 0.8)',
        fill: 'rgba(34, 197, 94, 0.1)',
      },
      ratings: {
        line: 'rgba(59, 130, 246, 0.8)',
        fill: 'rgba(59, 130, 246, 0.1)',
      },
    };

    // Combine real data
    const allComplaints = [
      ...(Array.isArray(complaints) ? complaints : []),
      ...(Array.isArray(publicComplaints) ? publicComplaints : []),
    ];
    const allFeedback = [
      ...(Array.isArray(feedback) ? feedback : []),
      ...(Array.isArray(publicFeedback) ? publicFeedback : []),
    ];
    const allRatings = [
      ...(Array.isArray(ratings) ? ratings : []),
      ...(Array.isArray(publicRatings) ? publicRatings : []),
    ];

    // Generate data based on timeRange
    let labels: string[] = [];
    let complaintsData: number[] = [];
    let feedbackData: number[] = [];
    let ratingsData: number[] = [];

    const now = new Date();

    if (timeRange === 'weekly') {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      // Get data for each day of the week
      for (let i = 6; i >= 0; i--) {
        const date = subDays(now, i);
        const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);

        const dayComplaints = allComplaints.filter((c) =>
          isWithinInterval(parseISO(c.created_at), {
            start: dayStart,
            end: dayEnd,
          })
        ).length;

        const dayFeedback = allFeedback.filter((f) =>
          isWithinInterval(parseISO(f.created_at), {
            start: dayStart,
            end: dayEnd,
          })
        ).length;

        const dayRatings = allRatings.filter((r) =>
          isWithinInterval(parseISO(r.created_at), {
            start: dayStart,
            end: dayEnd,
          })
        ).length;

        complaintsData.push(dayComplaints);
        feedbackData.push(dayFeedback);
        ratingsData.push(dayRatings);
      }
    } else if (timeRange === 'monthly') {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      // Get data for each month of the current year
      for (let i = 0; i < 12; i++) {
        const monthStart = new Date(now.getFullYear(), i, 1);
        const monthEnd = new Date(now.getFullYear(), i + 1, 0, 23, 59, 59);

        const monthComplaints = allComplaints.filter((c) =>
          isWithinInterval(parseISO(c.created_at), {
            start: monthStart,
            end: monthEnd,
          })
        ).length;

        const monthFeedback = allFeedback.filter((f) =>
          isWithinInterval(parseISO(f.created_at), {
            start: monthStart,
            end: monthEnd,
          })
        ).length;

        const monthRatings = allRatings.filter((r) =>
          isWithinInterval(parseISO(r.created_at), {
            start: monthStart,
            end: monthEnd,
          })
        ).length;

        complaintsData.push(monthComplaints);
        feedbackData.push(monthFeedback);
        ratingsData.push(monthRatings);
      }
    } else {
      // yearly - last 7 years
      labels = [];
      for (let i = 6; i >= 0; i--) {
        const year = now.getFullYear() - i;
        labels.push(year.toString());

        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31, 23, 59, 59);

        const yearComplaints = allComplaints.filter((c) =>
          isWithinInterval(parseISO(c.created_at), {
            start: yearStart,
            end: yearEnd,
          })
        ).length;

        const yearFeedback = allFeedback.filter((f) =>
          isWithinInterval(parseISO(f.created_at), {
            start: yearStart,
            end: yearEnd,
          })
        ).length;

        const yearRatings = allRatings.filter((r) =>
          isWithinInterval(parseISO(r.created_at), {
            start: yearStart,
            end: yearEnd,
          })
        ).length;

        complaintsData.push(yearComplaints);
        feedbackData.push(yearFeedback);
        ratingsData.push(yearRatings);
      }
    }

    // If no data, show fallback data
    if (
      complaintsData.every((d) => d === 0) &&
      feedbackData.every((d) => d === 0) &&
      ratingsData.every((d) => d === 0)
    ) {
      if (timeRange === 'weekly') {
        complaintsData = [2, 5, 3, 8, 4, 1, 3];
        feedbackData = [1, 3, 2, 4, 6, 3, 2];
        ratingsData = [1, 2, 4, 3, 5, 2, 3];
      } else if (timeRange === 'monthly') {
        complaintsData = [12, 15, 8, 20, 18, 10, 25, 22, 16, 14, 19, 21];
        feedbackData = [8, 12, 6, 15, 12, 8, 18, 16, 12, 10, 14, 16];
        ratingsData = [5, 8, 4, 12, 10, 6, 14, 12, 8, 7, 11, 13];
      } else {
        complaintsData = [85, 105, 125, 145, 165, 185, 205];
        feedbackData = [45, 55, 65, 75, 85, 95, 105];
        ratingsData = [25, 35, 45, 55, 65, 75, 85];
      }
    }

    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const maxValue = Math.max(...complaintsData, ...feedbackData, ...ratingsData) * 1.2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.beginPath();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // Horizontal grid lines
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding + chartHeight - (chartHeight / gridLines) * i;
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
    }

    // Vertical grid lines
    for (let i = 0; i <= labels.length; i++) {
      const x = padding + (chartWidth / labels.length) * i;
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
    }
    ctx.stroke();

    // Function to draw a line series
    const drawLineSeries = (data: number[], color: { line: string; fill: string }) => {
      if (data.length === 0) return;

      const points: [number, number][] = data.map((value, index) => {
        const x = padding + (chartWidth / (labels.length - 1)) * index;
        const y = padding + chartHeight - (value / (maxValue || 1)) * chartHeight;
        return [x, y];
      });

      // Draw fill
      ctx.beginPath();
      ctx.moveTo(points[0][0], padding + chartHeight);
      points.forEach((point) => {
        ctx.lineTo(point[0], point[1]);
      });
      ctx.lineTo(points[points.length - 1][0], padding + chartHeight);
      ctx.closePath();
      ctx.fillStyle = color.fill;
      ctx.fill();

      // Draw line
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      points.forEach((point, i) => {
        if (i > 0) {
          ctx.lineTo(point[0], point[1]);
        }
      });
      ctx.strokeStyle = color.line;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw points
      points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point[0], point[1], 4, 0, Math.PI * 2);
        ctx.fillStyle = color.line;
        ctx.fill();
        ctx.strokeStyle = isDark ? '#1e1e1e' : '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });
    };

    // Draw all data series
    drawLineSeries(complaintsData, colors.complaints);
    drawLineSeries(feedbackData, colors.feedback);
    drawLineSeries(ratingsData, colors.ratings);

    // X-axis labels
    ctx.fillStyle = textColor;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((label, i) => {
      const x = padding + (chartWidth / (labels.length - 1)) * i;
      ctx.fillText(label, x, padding + chartHeight + 20);
    });

    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= gridLines; i++) {
      const value = Math.round(((maxValue || 1) / gridLines) * i);
      const y = padding + chartHeight - (chartHeight / gridLines) * i;
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }

    // Legend
    const legendX = padding;
    const legendY = padding - 15;
    const legendItemWidth = 80;

    // Complaints
    ctx.beginPath();
    ctx.rect(legendX, legendY, 12, 6);
    ctx.fillStyle = colors.complaints.line;
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.textAlign = 'left';
    ctx.fillText('Complaints', legendX + 18, legendY + 5);

    // Feedback
    ctx.beginPath();
    ctx.rect(legendX + legendItemWidth, legendY, 12, 6);
    ctx.fillStyle = colors.feedback.line;
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.fillText('Feedback', legendX + legendItemWidth + 18, legendY + 5);

    // Ratings
    ctx.beginPath();
    ctx.rect(legendX + legendItemWidth * 2, legendY, 12, 6);
    ctx.fillStyle = colors.ratings.line;
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.fillText('Ratings', legendX + legendItemWidth * 2 + 18, legendY + 5);
  }, [
    theme,
    timeRange,
    t,
    complaints,
    publicComplaints,
    feedback,
    publicFeedback,
    ratings,
    publicRatings,
  ]);

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
