'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export function DashboardChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

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
    const barColor = isDark ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.8)';
    const barHoverColor = isDark ? 'rgba(59, 130, 246, 1)' : 'rgba(59, 130, 246, 1)';

    // Data
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const data = [12, 19, 15, 8, 22, 14, 25, 18, 16, 20, 24, 15];

    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    const barWidth = (chartWidth / data.length) * 0.6;
    const barSpacing = (chartWidth / data.length) * 0.4;
    const maxValue = Math.max(...data) * 1.2;

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
    for (let i = 0; i <= data.length; i++) {
      const x = padding + (chartWidth / data.length) * i;
      ctx.moveTo(x, padding);
      ctx.lineTo(x, padding + chartHeight);
    }
    ctx.stroke();

    // Draw bars
    for (let i = 0; i < data.length; i++) {
      const x = padding + (chartWidth / data.length) * i + barSpacing / 2;
      const barHeight = (data[i] / maxValue) * chartHeight;
      const y = padding + chartHeight - barHeight;

      // Bar
      ctx.fillStyle = barColor;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
      ctx.fill();

      // Month label
      ctx.fillStyle = textColor;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(months[i], x + barWidth / 2, padding + chartHeight + 20);
    }

    // Y-axis labels
    ctx.fillStyle = textColor;
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';

    for (let i = 0; i <= gridLines; i++) {
      const value = Math.round((maxValue / gridLines) * i);
      const y = padding + chartHeight - (chartHeight / gridLines) * i;
      ctx.fillText(value.toString(), padding - 10, y + 4);
    }
  }, [theme]);

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
