
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, CloudRain, Sun, Wind } from "lucide-react";

interface WeatherCardProps {
  data: {
    location: string;
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    forecast: Array<{
      day: string;
      condition: string;
      high: number;
      low: number;
    }>;
  };
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-8 w-8 text-amber-500" />;
      case "partly cloudy":
        return <CloudSun className="h-8 w-8 text-blue-400" />;
      case "rainy":
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      default:
        return <CloudSun className="h-8 w-8 text-blue-400" />;
    }
  };

  return (
    <Card className="hoverable overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{data.location}</CardTitle>
            <p className="text-sm opacity-80">Today</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{data.temperature}°C</p>
            <p>{data.condition}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center">
            <div className="bg-blue-50 p-2 rounded-full mr-3">
              <Wind className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="font-medium">{data.windSpeed} km/h</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-blue-50 p-2 rounded-full mr-3">
              <CloudRain className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="font-medium">{data.humidity}%</p>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4 mt-2">
          <h4 className="text-sm font-semibold mb-3">5-Day Forecast</h4>
          <div className="space-y-3">
            {data.forecast.map((day, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center">
                  {getWeatherIcon(day.condition)}
                  <span className="ml-2">{day.day}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{day.high}°</span>
                  <span className="text-muted-foreground">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
