
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import WeatherCard from "@/components/weather/WeatherCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudSun, Droplet, Wind, Thermometer, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const mockWeatherData = {
  location: "Greenfield Farm",
  temperature: 24,
  condition: "Partly Cloudy",
  humidity: 45,
  windSpeed: 12,
  forecast: [
    { day: "Tomorrow", condition: "Sunny", high: 26, low: 18 },
    { day: "Wednesday", condition: "Partly Cloudy", high: 25, low: 17 },
    { day: "Thursday", condition: "Rainy", high: 22, low: 16 },
    { day: "Friday", condition: "Partly Cloudy", high: 23, low: 15 },
    { day: "Saturday", condition: "Sunny", high: 27, low: 18 },
  ],
};

const locations = [
  { id: "greenfield", name: "Greenfield Farm", data: mockWeatherData },
  { id: "north", name: "North Field", data: { ...mockWeatherData, location: "North Field", temperature: 23, humidity: 48 } },
  { id: "south", name: "South Field", data: { ...mockWeatherData, location: "South Field", temperature: 25, humidity: 42 } },
];

const rainfallData = [
  { month: "Jan", amount: 2.4 },
  { month: "Feb", amount: 3.2 },
  { month: "Mar", amount: 4.5 },
  { month: "Apr", amount: 3.8 },
  { month: "May", amount: 2.1 },
  { month: "Jun", amount: 1.5 },
  { month: "Jul", amount: 1.2 },
  { month: "Aug", amount: 0.9 },
  { month: "Sep", amount: 1.8 },
  { month: "Oct", amount: 2.7 },
  { month: "Nov", amount: 3.2 },
  { month: "Dec", amount: 4.1 },
];

const temperatureData = [
  { month: "Jan", high: 15, low: 5 },
  { month: "Feb", high: 17, low: 6 },
  { month: "Mar", high: 20, low: 8 },
  { month: "Apr", high: 23, low: 12 },
  { month: "May", high: 26, low: 15 },
  { month: "Jun", high: 29, low: 18 },
  { month: "Jul", high: 31, low: 20 },
  { month: "Aug", high: 30, low: 19 },
  { month: "Sep", high: 27, low: 16 },
  { month: "Oct", high: 23, low: 12 },
  { month: "Nov", high: 18, low: 8 },
  { month: "Dec", high: 15, low: 5 },
];

const humidityData = [
  { month: "Jan", value: 75 },
  { month: "Feb", value: 70 },
  { month: "Mar", value: 65 },
  { month: "Apr", value: 60 },
  { month: "May", value: 55 },
  { month: "Jun", value: 50 },
  { month: "Jul", value: 45 },
  { month: "Aug", value: 50 },
  { month: "Sep", value: 55 },
  { month: "Oct", value: 65 },
  { month: "Nov", value: 70 },
  { month: "Dec", value: 75 },
];

const Weather = () => {
  const [selectedLocation, setSelectedLocation] = useState("greenfield");
  const [weatherData, setWeatherData] = useState(mockWeatherData);
  const [loading, setLoading] = useState(false);
  const [activeChart, setActiveChart] = useState("rainfall");
  const { toast } = useToast();

  // Simulate fetching weather data
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const location = locations.find(loc => loc.id === selectedLocation);
      if (location) {
        setWeatherData(location.data);
      }
      
      setLoading(false);
    };
    
    fetchWeather();
  }, [selectedLocation]);

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    toast({
      title: "Location Updated",
      description: `Weather data for ${locations.find(loc => loc.id === value)?.name || value} loaded.`,
      duration: 3000,
    });
  };

  const renderChart = () => {
    switch (activeChart) {
      case "rainfall":
        return (
          <div className="h-72">
            <div className="w-full h-full flex items-end justify-between">
              {rainfallData.map((month, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-blue-500 rounded-t-md transition-all duration-300" 
                    style={{ height: `${month.amount * 30}px` }}
                  ></div>
                  <span className="text-xs mt-2">{month.month}</span>
                  <span className="text-xs text-muted-foreground">{month.amount}cm</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "temperature":
        return (
          <div className="h-72">
            <div className="w-full h-full flex items-end justify-between">
              {temperatureData.map((month, index) => (
                <div key={index} className="flex flex-col items-center w-full">
                  <div className="relative w-8">
                    <div 
                      className="absolute w-full bg-red-400 rounded-t-md transition-all duration-300" 
                      style={{ 
                        height: `${month.high * 2}px`,
                        bottom: `${month.low * 2}px` 
                      }}
                    ></div>
                    <div 
                      className="absolute w-full bg-blue-400 rounded-b-md transition-all duration-300" 
                      style={{ height: `${month.low * 2}px`, bottom: 0 }}
                    ></div>
                  </div>
                  <span className="text-xs mt-2">{month.month}</span>
                  <div className="text-xs text-muted-foreground">
                    <span className="text-red-400">{month.high}°</span>
                    <span> / </span>
                    <span className="text-blue-400">{month.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "humidity":
        return (
          <div className="h-72">
            <div className="w-full h-full flex items-end justify-between">
              {humidityData.map((month, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-teal-500 rounded-t-md transition-all duration-300" 
                    style={{ height: `${month.value}px` }}
                  ></div>
                  <span className="text-xs mt-2">{month.month}</span>
                  <span className="text-xs text-muted-foreground">{month.value}%</span>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <CloudSun className="mr-2 h-7 w-7 text-farmlink-green" />
              Weather Forecast
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor weather conditions for better farming decisions
            </p>
          </div>
          <Select value={selectedLocation} onValueChange={handleLocationChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map(location => (
                <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <Card className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-farmlink-green mx-auto"></div>
                  <p className="mt-4">Loading weather data...</p>
                </div>
              </Card>
            ) : (
              <WeatherCard data={weatherData} />
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Current Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Thermometer className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="font-semibold">{weatherData.temperature}°C</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Droplet className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="font-semibold">{weatherData.humidity}%</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Wind className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wind Speed</p>
                  <p className="font-semibold">{weatherData.windSpeed} km/h</p>
                </div>
              </div>
              
              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <MapPin className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Precipitation Chance</p>
                  <p className="font-semibold">20%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Climate Analytics</h2>
          
          <Tabs value={activeChart} onValueChange={setActiveChart}>
            <TabsList>
              <TabsTrigger value="rainfall">Rainfall</TabsTrigger>
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="humidity">Humidity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rainfall" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Annual Rainfall Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderChart()}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="temperature" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Temperature Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderChart()}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="humidity" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Humidity Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderChart()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weather Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-md">
                  <p className="font-medium text-yellow-800">Light Rain Advisory</p>
                  <p className="text-sm text-yellow-700">
                    Expected light rain tomorrow afternoon. Consider adjusting irrigation schedules.
                  </p>
                </div>
                <button 
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => {
                    toast({
                      title: "Alert Subscription Updated",
                      description: "You will be notified when new weather alerts are issued.",
                      duration: 3000,
                    });
                  }}
                >
                  Subscribe to weather alerts
                </button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Farming Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Based on current forecast:</h4>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li className="text-sm">Optimal planting conditions for the next 48 hours</li>
                    <li className="text-sm">Delay fertilizer application until after Thursday's rain</li>
                    <li className="text-sm">Good conditions for harvesting mature crops tomorrow</li>
                  </ul>
                </div>
                <div className="pt-2 border-t">
                  <button 
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => {
                      toast({
                        title: "Custom Recommendation",
                        description: "Your custom recommendation request has been submitted.",
                        duration: 3000,
                      });
                    }}
                  >
                    Request custom recommendations
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Weather;
