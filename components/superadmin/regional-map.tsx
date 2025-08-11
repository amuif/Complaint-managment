'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { useLanguage } from '@/components/language-provider';

export function RegionalMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const { t } = useLanguage();

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
    const backgroundColor = isDark ? '#1e1e1e' : '#f8f9fa';

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw placeholder map
    ctx.fillStyle = textColor;
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(t('interactiveMapComingSoon'), canvas.width / 2, canvas.height / 2);

    // Sample data for regions
    const regions = [
      { name: 'Addis Ababa', value: 85, x: canvas.width * 0.5, y: canvas.height * 0.5 },
      { name: 'Amhara', value: 65, x: canvas.width * 0.3, y: canvas.height * 0.3 },
      { name: 'Oromia', value: 75, x: canvas.width * 0.7, y: canvas.height * 0.6 },
      { name: 'Tigray', value: 45, x: canvas.width * 0.2, y: canvas.height * 0.2 },
      { name: 'SNNPR', value: 55, x: canvas.width * 0.6, y: canvas.height * 0.7 },
    ];

    // Draw circles for each region
    regions.forEach((region) => {
      // Calculate circle size based on value
      const radius = (region.value / 100) * 30 + 10;

      // Draw circle
      ctx.beginPath();
      ctx.arc(region.x, region.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(59, 130, 246, ${region.value / 100})`;
      ctx.fill();
      ctx.strokeStyle = isDark ? '#ffffff' : '#000000';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw region name
      ctx.fillStyle = textColor;
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(region.name, region.x, region.y - radius - 5);

      // Draw value
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText(region.value.toString(), region.x, region.y + 4);
    });
  }, [theme, t]);

  return (
    <div className="h-[300px] w-full">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
