import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudSun, Droplet, Wind } from "lucide-react";
import { apiClient } from "@/lib/api";

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    location: "Loading...",
    temperature: 0,
    condition: "Loading...",
    humidity: 0,
    windSpeed: 0,
    high: 0,
    low: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const data = await apiClient.getWeather();
        
        // Ensure all numeric values are numbers
        setWeather({
          location: data.location || "Farm Location",
          temperature: Math.round(Number(data.temperature) || 0),
          condition: data.condition || "Unknown",
          humidity: Math.round(Number(data.humidity) || 0),
          windSpeed: Math.round(Number(data.windSpeed) || 0),
          high: Math.round(Number(data.high) || 0),
          low: Math.round(Number(data.low) || 0),
        });
      } catch (err) {
        console.error("Failed to fetch weather:", err);
        setError("Weather data unavailable");
        setWeather(prev => ({
          ...prev,
          location: "Farm Location",
          condition: "Data Unavailable",
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, []);


  const getWeatherIcon = (condition: string) => {
    if (!condition) return "⛅";
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes("sun")) return "☀️";
    if (conditionLower.includes("cloud")) return "⛅";
    if (conditionLower.includes("rain")) return "🌧️";
    if (conditionLower.includes("snow")) return "❄️";
    return "⛅";
  };

  if (isLoading) {
    return (
      <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-farmlink-darkgreen flex items-center">
            <CloudSun className="w-5 h-5 mr-2 text-farmlink-green" />
            Loading Weather...
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-farmlink-green"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 ">
      <CardHeader className="pb-4">
        <CardTitle className="text-farmlink-darkgreen flex items-center">
          <CloudSun className="w-5 h-5 mr-2 text-farmlink-green" />
          Today's Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-farmlink-darkgreen">
              {weather.temperature}°C
            </p>
            <p className="text-farmlink-darkgreen/70">
              {error ? "Weather Unavailable" : weather.condition}
            </p>
            <p className="text-sm text-farmlink-darkgreen/60">
              {weather.location}
            </p>
          </div>
          <div className="text-4xl">
            {getWeatherIcon(weather.condition)}
          </div>
        </div>
        
        {!error && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-farmlink-darkgreen/70">H: {weather.high}°</span>
              <span className="text-farmlink-darkgreen/70">L: {weather.low}°</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-farmlink-lightgreen/20">
              <div className="flex items-center space-x-2">
                <Droplet className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-farmlink-darkgreen/60">Humidity</p>
                  <p className="font-medium text-farmlink-darkgreen">
                    {weather.humidity}%
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Wind className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-farmlink-darkgreen/60">Wind</p>
                  <p className="font-medium text-farmlink-darkgreen">
                    {weather.windSpeed} km/h
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
        
        {error && (
          <p className="text-sm text-red-500 mt-2">
            {error} - Showing limited data
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;