
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
          <div className="h-72 p-4">
            <div className="w-full h-full flex items-end justify-between bg-gradient-to-t from-farmlink-offwhite/30 to-transparent rounded-xl p-4">
              {rainfallData.map((month, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div 
                    className="w-8 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-300 hover:from-farmlink-green hover:to-farmlink-mediumgreen shadow-lg group-hover:shadow-xl" 
                    style={{ height: `${month.amount * 30}px` }}
                  ></div>
                  <span className="text-xs mt-2 font-medium text-farmlink-darkgreen">{month.month}</span>
                  <span className="text-xs text-farmlink-darkgreen/70 font-semibold">{month.amount}cm</span>
                </div>
              ))}
            </div>
          </div>
        );
      case "temperature":
        return (
          <div className="h-72 p-4">
            <div className="w-full h-full flex items-end justify-between bg-gradient-to-t from-farmlink-offwhite/30 to-transparent rounded-xl p-4">
              {temperatureData.map((month, index) => (
                <div key={index} className="flex flex-col items-center w-full group">
                  <div className="relative w-8">
                    <div 
                      className="absolute w-full bg-gradient-to-t from-red-500 to-red-300 rounded-t-md transition-all duration-300 group-hover:from-farmlink-green group-hover:to-farmlink-mediumgreen shadow-lg" 
                      style={{ 
                        height: `${month.high * 2}px`,
                        bottom: `${month.low * 2}px` 
                      }}
                    ></div>
                    <div 
                      className="absolute w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-b-md transition-all duration-300 group-hover:from-blue-600 group-hover:to-blue-400 shadow-lg" 
                      style={{ height: `${month.low * 2}px`, bottom: 0 }}
                    ></div>
                  </div>
                  <span className="text-xs mt-2 font-medium text-farmlink-darkgreen">{month.month}</span>
                  <div className="text-xs text-farmlink-darkgreen/70 font-semibold">
                    <span className="text-red-500">{month.high}°</span>
                    <span> / </span>
                    <span className="text-blue-500">{month.low}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "humidity":
        return (
          <div className="h-72 p-4">
            <div className="w-full h-full flex items-end justify-between bg-gradient-to-t from-farmlink-offwhite/30 to-transparent rounded-xl p-4">
              {humidityData.map((month, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div 
                    className="w-8 bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-md transition-all duration-300 hover:from-farmlink-green hover:to-farmlink-mediumgreen shadow-lg group-hover:shadow-xl" 
                    style={{ height: `${month.value}px` }}
                  ></div>
                  <span className="text-xs mt-2 font-medium text-farmlink-darkgreen">{month.month}</span>
                  <span className="text-xs text-farmlink-darkgreen/70 font-semibold">{month.value}%</span>
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
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold flex items-center bg-gradient-to-r from-farmlink-darkgreen to-farmlink-green bg-clip-text text-transparent">
              <CloudSun className="mr-3 h-8 w-8 text-farmlink-green" />
              Weather Forecast
            </h1>
            <p className="text-farmlink-darkgreen/70 text-lg font-medium">
              Monitor weather conditions for better farming decisions
            </p>
          </div>
          <Select value={selectedLocation} onValueChange={handleLocationChange}>
            <SelectTrigger className="w-[200px] bg-white/80 backdrop-blur-sm border-2 border-farmlink-lightgreen/30 text-farmlink-darkgreen hover:border-farmlink-green focus:border-farmlink-green transition-all duration-300 rounded-xl shadow-lg">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-sm border-2 border-farmlink-lightgreen/30 shadow-xl rounded-xl">
              {locations.map(location => (
                <SelectItem 
                  key={location.id} 
                  value={location.id}
                  className="text-farmlink-darkgreen hover:bg-farmlink-lightgreen/20 focus:bg-farmlink-lightgreen/30 transition-colors duration-200"
                >
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading ? (
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-farmlink-lightgreen border-t-farmlink-green mx-auto"></div>
                    <p className="text-farmlink-darkgreen font-medium text-lg">Loading weather data...</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="transform hover:scale-[1.02] transition-all duration-300">
                <WeatherCard data={weatherData} />
              </div>
            )}
          </div>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen text-white">
              <CardTitle className="text-xl font-bold">Current Conditions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/30 hover:shadow-md transition-all duration-300">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full mr-4 shadow-lg">
                  <Thermometer className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-farmlink-darkgreen/70 font-medium">Temperature</p>
                  <p className="font-bold text-xl text-farmlink-darkgreen">{weatherData.temperature}°C</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gradient-to-r from-cyan-50 to-cyan-100/50 rounded-xl border border-cyan-200/30 hover:shadow-md transition-all duration-300">
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 rounded-full mr-4 shadow-lg">
                  <Droplet className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-farmlink-darkgreen/70 font-medium">Humidity</p>
                  <p className="font-bold text-xl text-farmlink-darkgreen">{weatherData.humidity}%</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gradient-to-r from-indigo-50 to-indigo-100/50 rounded-xl border border-indigo-200/30 hover:shadow-md transition-all duration-300">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-full mr-4 shadow-lg">
                  <Wind className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-farmlink-darkgreen/70 font-medium">Wind Speed</p>
                  <p className="font-bold text-xl text-farmlink-darkgreen">{weatherData.windSpeed} km/h</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-xl border border-emerald-200/30 hover:shadow-md transition-all duration-300">
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-full mr-4 shadow-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-farmlink-darkgreen/70 font-medium">Precipitation Chance</p>
                  <p className="font-bold text-xl text-farmlink-darkgreen">20%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-farmlink-darkgreen to-farmlink-green bg-clip-text text-transparent">Climate Analytics</h2>
          
          <Tabs value={activeChart} onValueChange={setActiveChart} className="space-y-6">
            <TabsList className="bg-white/80 backdrop-blur-sm border-2 border-farmlink-lightgreen/30 p-1 rounded-xl shadow-lg">
              <TabsTrigger 
                value="rainfall"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-farmlink-green data-[state=active]:to-farmlink-mediumgreen data-[state=active]:text-white text-farmlink-darkgreen font-medium px-6 py-2 rounded-lg transition-all duration-300"
              >
                Rainfall
              </TabsTrigger>
              <TabsTrigger 
                value="temperature"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-farmlink-green data-[state=active]:to-farmlink-mediumgreen data-[state=active]:text-white text-farmlink-darkgreen font-medium px-6 py-2 rounded-lg transition-all duration-300"
              >
                Temperature
              </TabsTrigger>
              <TabsTrigger 
                value="humidity"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-farmlink-green data-[state=active]:to-farmlink-mediumgreen data-[state=active]:text-white text-farmlink-darkgreen font-medium px-6 py-2 rounded-lg transition-all duration-300"
              >
                Humidity
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="rainfall" className="pt-4">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                  <CardTitle className="text-xl font-bold">Annual Rainfall Distribution</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {renderChart()}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="temperature" className="pt-4">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-red-500 to-orange-500 text-white">
                  <CardTitle className="text-xl font-bold">Temperature Trends</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {renderChart()}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="humidity" className="pt-4">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-teal-600 to-teal-500 text-white">
                  <CardTitle className="text-xl font-bold">Humidity Patterns</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {renderChart()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <CardTitle className="text-xl font-bold">Weather Alerts</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="p-4 border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                  <p className="font-bold text-amber-800 text-lg mb-2">Light Rain Advisory</p>
                  <p className="text-amber-700 leading-relaxed">
                    Expected light rain tomorrow afternoon. Consider adjusting irrigation schedules.
                  </p>
                </div>
                <button 
                  className="text-farmlink-green hover:text-farmlink-darkgreen font-semibold transition-colors duration-200 hover:underline decoration-2 underline-offset-4"
                  onClick={() => {
                    toast({
                      title: "Alert Subscription Updated",
                      description: "You will be notified when new weather alerts are issued.",
                      duration: 3000,
                    });
                  }}
                >
                  Subscribe to weather alerts →
                </button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen text-white">
              <CardTitle className="text-xl font-bold">Farming Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-farmlink-darkgreen text-lg mb-3">Based on current forecast:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-farmlink-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-farmlink-darkgreen leading-relaxed">Optimal planting conditions for the next 48 hours</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-farmlink-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-farmlink-darkgreen leading-relaxed">Delay fertilizer application until after Thursday's rain</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-farmlink-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-farmlink-darkgreen leading-relaxed">Good conditions for harvesting mature crops tomorrow</span>
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-farmlink-lightgreen/30">
                  <button 
                    className="text-farmlink-green hover:text-farmlink-darkgreen font-semibold transition-colors duration-200 hover:underline decoration-2 underline-offset-4"
                    onClick={() => {
                      toast({
                        title: "Custom Recommendation",
                        description: "Your custom recommendation request has been submitted.",
                        duration: 3000,
                      });
                    }}
                  >
                    Request custom recommendations →
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