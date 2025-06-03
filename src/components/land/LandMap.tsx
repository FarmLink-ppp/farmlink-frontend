
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { LandPlot } from '@/types/land';

interface LandMapProps {
  selectedCrop: string;
  color: string;
  isDrawing: boolean;
  onPlotComplete: (plot: LandPlot) => void;
}

const LandMap: React.FC<LandMapProps> = ({ selectedCrop, color, isDrawing, onPlotComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPoints, setCurrentPoints] = useState<[number, number][]>([]);
  const [plots, setPlots] = useState<LandPlot[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Setup canvas and draw existing plots
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing plots
    plots.forEach((plot) => {
      drawPlot(ctx, plot.coordinates, plot.color);
      labelPlot(ctx, plot);
    });

    // Draw current plot being created
    if (currentPoints.length > 1) {
      drawPlot(ctx, currentPoints, color);
    }
  }, [plots, currentPoints, color]);

  // Draw a single plot on the canvas
  const drawPlot = (ctx: CanvasRenderingContext2D, points: [number, number][], color: string) => {
    if (points.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }
    
    // Close the shape
    if (points.length > 2) {
      ctx.lineTo(points[0][0], points[0][1]);
    }
    
    ctx.fillStyle = `${color}80`; // 50% transparency
    ctx.fill();
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  // Add a label to the plot
  const labelPlot = (ctx: CanvasRenderingContext2D, plot: LandPlot) => {
    if (plot.coordinates.length === 0) return;
    
    // Find center of the polygon
    let avgX = 0, avgY = 0;
    plot.coordinates.forEach(point => {
      avgX += point[0];
      avgY += point[1];
    });
    avgX /= plot.coordinates.length;
    avgY /= plot.coordinates.length;
    
    // Draw text
    ctx.font = '14px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.fillText(plot.crop, avgX, avgY);
  };

  // Calculate approximate area of polygon
  const calculateArea = (points: [number, number][]): number => {
    if (points.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i][0] * points[j][1];
      area -= points[j][0] * points[i][1];
    }
    
    return Math.abs(area / 2);
  };

  // Mouse/touch event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentPoints([...currentPoints, [x, y]]);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isDragging) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentPoints([...currentPoints.slice(0, -1), [x, y]]);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // If this is a double-click and we have at least 3 points, complete the polygon
    if (e.detail === 2 && currentPoints.length >= 3) {
      const newPlot: LandPlot = {
        id: Date.now().toString(),
        name: `${selectedCrop} Plot ${plots.length + 1}`,
        crop: selectedCrop,
        color: color,
        coordinates: [...currentPoints]
      };
      
      setPlots([...plots, newPlot]);
      setCurrentPoints([]);
      onPlotComplete(newPlot);
    } else {
      setCurrentPoints([...currentPoints, [x, y]]);
    }
  };

  const clearLastPoint = () => {
    if (currentPoints.length > 0) {
      setCurrentPoints(currentPoints.slice(0, -1));
    }
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border border-gray-200 bg-white">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <div className="absolute bottom-2 left-2 bg-white p-2 rounded shadow text-xs">
        {isDrawing ? 'Click to add points. Double-click to complete.' : 'Select a crop and start drawing to add plots.'}
      </div>
      {currentPoints.length > 0 && (
        <button
          className="absolute top-2 right-2 bg-white p-2 rounded shadow text-xs"
          onClick={clearLastPoint}
        >
          Undo Last Point
        </button>
      )}
    </div>
  );
};

export default LandMap;
