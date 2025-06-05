
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, Thermometer, Droplet, Wind } from "lucide-react";

const WeatherWidget = () => {
  // Mock weather data for today
  const todayWeather = {
    location: "Greenfield Farm",
    temperature: 24,
    condition: "Partly Cloudy",
    humidity: 45,
    windSpeed: 12,
    high: 26,
    low: 18,
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <div className="text-4xl">☀️</div>;
      case "partly cloudy":
        return <div className="text-4xl">⛅</div>;
      case "rainy":
        return <div className="text-4xl">🌧️</div>;
      default:
        return <div className="text-4xl">⛅</div>;
    }
  };

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-farmlink-darkgreen flex items-center">
          <CloudSun className="w-5 h-5 mr-2 text-farmlink-green" />
          Today's Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-farmlink-darkgreen">{todayWeather.temperature}°C</p>
            <p className="text-farmlink-darkgreen/70">{todayWeather.condition}</p>
            <p className="text-sm text-farmlink-darkgreen/60">{todayWeather.location}</p>
          </div>
          <div className="flex items-center">
            {getWeatherIcon(todayWeather.condition)}
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-farmlink-darkgreen/70">H: {todayWeather.high}°</span>
          <span className="text-farmlink-darkgreen/70">L: {todayWeather.low}°</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-farmlink-lightgreen/20">
          <div className="flex items-center space-x-2">
            <Droplet className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-farmlink-darkgreen/60">Humidity</p>
              <p className="font-medium text-farmlink-darkgreen">{todayWeather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-farmlink-darkgreen/60">Wind</p>
              <p className="font-medium text-farmlink-darkgreen">{todayWeather.windSpeed} km/h</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;