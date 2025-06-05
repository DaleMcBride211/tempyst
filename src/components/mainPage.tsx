'use client'
import React, { useState, useEffect } from 'react';

// --- Shadcn/ui Imports ---
// Adjust the path according to your project structure
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

// --- Type Definitions ---
interface LocationData {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch?: number; // epoch time
  localtime?: string; // Formatted local time string e.g., "2024-05-31 10:30"
}

interface CurrentWeatherData {
  last_updated_epoch: number;
  last_updated: string; // Formatted last updated string
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: {
    text: string;
    icon: string; // URL, might be protocol-relative (e.g., //cdn.weatherapi.com/...)
    code: number;
  };
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c?: number;
  windchill_f?: number;
  heatindex_c?: number;
  heatindex_f?: number;
  dewpoint_c: number;
  dewpoint_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
}

interface WeatherCondition {
  text: string;          // Weather condition text, e.g., "Sunny", "Clear "
  icon: string;          // URL to the weather icon
  code: number;          // Weather condition unique code
}

interface AstroData {
  sunrise: string;             // Sunrise time, e.g., "05:03 AM"
  sunset: string;              // Sunset time, e.g., "08:52 PM"
  moonrise: string;            // Moonrise time, e.g., "02:05 AM"
  moonset: string;             // Moonset time, e.g., "10:39 AM"
  moon_phase: string;          // Moon phase, e.g., "Waning Gibbous"
  moon_illumination: number;   // Moon illumination percentage, e.g., 66
  is_moon_up: number;          // 1 if moon is up, 0 if not
  is_sun_up: number;           // 1 if sun is up, 0 if not
}

/**
 * Represents the daily weather forecast data.
 */
interface DayData {
  maxtemp_c: number;            // Maximum temperature in Celsius
  maxtemp_f: number;            // Maximum temperature in Fahrenheit
  mintemp_c: number;            // Minimum temperature in Celsius
  mintemp_f: number;            // Minimum temperature in Fahrenheit
  avgtemp_c: number;            // Average temperature in Celsius
  avgtemp_f: number;            // Average temperature in Fahrenheit
  maxwind_mph: number;          // Maximum wind speed in miles per hour
  maxwind_kph: number;          // Maximum wind speed in kilometers per hour
  totalprecip_mm: number;       // Total precipitation in millimeters
  totalprecip_in: number;       // Total precipitation in inches
  totalsnow_cm: number;         // Total snowfall in centimeters
  avgvis_km: number;            // Average visibility in kilometers
  avgvis_miles: number;         // Average visibility in miles
  avghumidity: number;          // Average humidity as a percentage
  daily_will_it_rain: number;   // 1 if there is a chance of rain, 0 if not
  daily_chance_of_rain: number; // Chance of rain as a percentage
  daily_will_it_snow: number;   // 1 if there is a chance of snow, 0 if not
  daily_chance_of_snow: number; // Chance of snow as a percentage
  condition: WeatherCondition;  // Weather condition details
  uv: number;                   // UV index
}

/**
 * Represents the hourly weather forecast data.
 */
interface HourData {
  time_epoch: number;        // Epoch time for the hour
  time: string;              // Date and time, e.g., "2025-05-19 00:00"
  temp_c: number;            // Temperature in Celsius
  temp_f: number;            // Temperature in Fahrenheit
  is_day: number;            // 1 if it is day, 0 if it is night
  condition: WeatherCondition; // Weather condition details
  wind_mph: number;          // Wind speed in miles per hour
  wind_kph: number;          // Wind speed in kilometers per hour
  wind_degree: number;       // Wind direction in degrees
  wind_dir: string;          // Wind direction as a compass point, e.g., "ENE"
  pressure_mb: number;       // Pressure in millibars
  pressure_in: number;       // Pressure in inches
  precip_mm: number;         // Precipitation in millimeters
  precip_in: number;         // Precipitation in inches
  snow_cm: number;           // Snowfall in centimeters
  humidity: number;          // Humidity as a percentage
  cloud: number;             // Cloud cover as a percentage
  feelslike_c: number;       // Feels like temperature in Celsius
  feelslike_f: number;       // Feels like temperature in Fahrenheit
  windchill_c: number;       // Windchill temperature in Celsius
  windchill_f: number;       // Windchill temperature in Fahrenheit
  heatindex_c: number;       // Heat index in Celsius
  heatindex_f: number;       // Heat index in Fahrenheit
  dewpoint_c: number;        // Dew point in Celsius
  dewpoint_f: number;        // Dew point in Fahrenheit
  will_it_rain: number;      // 1 if there is a chance of rain, 0 if not
  chance_of_rain: number;    // Chance of rain as a percentage
  will_it_snow: number;      // 1 if there is a chance of snow, 0 if not
  chance_of_snow: number;    // Chance of snow as a percentage
  vis_km: number;            // Visibility in kilometers
  vis_miles: number;         // Visibility in miles
  gust_mph: number;          // Wind gust in miles per hour
  gust_kph: number;          // Wind gust in kilometers per hour
  uv: number;                // UV index
  short_rad: number;         // Shortwave radiation (available in history/forecast API)
  diff_rad: number;          // Diffuse radiation (available in history/forecast API)
}

/**
 * Represents the forecast for a single day.
 */
interface ForecastDay {
  date: string;
  date_epoch: number;
  day: DayData;
  astro: AstroData;
  hour: HourData[];
}

interface WeatherApiResponse {
  location: LocationData;
  current?: CurrentWeatherData;
  forecast: {                
    forecastday: ForecastDay[]; // contains the 'forecastday' array
  };
}

// --- Helper Functions for UV Index ---
const getUVClasses = (uv: number): string => {
  if (uv <= 2) return "bg-[#4A90E2] text-white"; // Low - Logo Secondary Blue (Light Blue)
  if (uv <= 5) return "bg-[#F5A623] text-black"; // Moderate - Logo Accent Yellow
  if (uv <= 7) return "bg-orange-500 text-white"; // High - Orange
  if (uv <= 10) return "bg-red-600 text-white";   // Very High - Red
  return "bg-purple-700 text-white"; // Extreme - Purple
};

const getUVDescription = (uv: number): string => {
  if (uv <= 2) return "Low";
  if (uv <= 5) return "Moderate";
  if (uv <= 7) return "High";
  if (uv <= 10) return "Very High";
  return "Extreme";
};


function MainPage() {
  const [data, setData] = useState<WeatherApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    const fetchData = async () => {
      if (!apiKey) {
        console.error("API key is missing.");
        setError("Configuration error: API key is missing. Please set NEXT_PUBLIC_API_KEY.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=London&days=3&aqi=no&alerts=no`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(`HTTP error! status: ${res.status}. ${errorData.error?.message || ''}`);
        }
        const result: WeatherApiResponse = await res.json();
        setData(result);
        console.log("Data fetched successfully:", result);
      } catch (e: any) {
        console.error("Failed to fetch data:", e);
        setError(e.message || "An unknown error occurred while fetching weather data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiKey]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-sky-50 dark:bg-[#0D1A2B]">
        <p className="text-xl text-[#1D3254] dark:text-sky-100">Loading weather data... ⏳</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-sky-50 dark:bg-[#0D1A2B]">
        <Card className="w-full max-w-md bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-200">Error 😥</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 dark:text-red-300">{error}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Please ensure your API key is correct and you have a stable internet connection.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data || !data.location || !data.current) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-sky-50 dark:bg-[#0D1A2B]">
        <p className="text-[#1D3254] dark:text-sky-100">No weather data available. Please try again later or check the location.</p>
      </div>
    );
  }

  const { location, current, forecast } = data;
  const weatherIconUrl = current.condition.icon.startsWith('//')
    ? `https:${current.condition.icon}`
    : current.condition.icon;

  return (
    <div className="container mx-auto p-4 flex flex-col min-h-screen bg-sky-50 dark:bg-[#0D1A2B]">
        <div>
            <Card className="w-full shadow-2xl rounded-xl overflow-hidden bg-white dark:bg-slate-800">
                <CardHeader className="bg-[#1D3254] text-white text-center p-6">
                <CardTitle className="text-3xl font-bold">
                    {location.name}
                </CardTitle>
                <CardDescription className="text-sky-200">
                    {location.region}, {location.country}
                    {location.localtime_epoch && (
                    <div className="text-sm mt-1">
                        Location Time: {new Date(location.localtime_epoch * 1000).toLocaleTimeString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                    )}
                </CardDescription>
                </CardHeader>

                <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Weather Info Section (Left) */}
                    <div className="lg:w-2/5 flex flex-col items-center text-center lg:items-start lg:text-left space-y-3 lg:border-r lg:border-slate-200 dark:lg:border-slate-700 lg:pr-6">
                    <img
                        src={weatherIconUrl}
                        alt={current.condition.text}
                        className="w-28 h-28"
                        width="112"
                        height="112"
                    />
                    <p className="text-6xl font-bold text-[#1D3254] dark:text-white">{current.temp_f}°F</p>
                    <p className="text-2xl text-[#2A3B4E] dark:text-sky-200">{current.condition.text}</p>
                    <p className="text-lg text-slate-500 dark:text-sky-300">Feels like {current.feelslike_f}°F</p>
                    </div>

                    {/* Weather Details Grid (Right) */}
                    <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-md">
                    {[
                        { label: "💨 Wind", value: `${current.wind_mph} mph (${current.wind_kph} kph) ${current.wind_dir}` },
                        { label: "💧 Humidity", value: `${current.humidity}%` },
                        { label: "🔻 Pressure", value: `${current.pressure_in} in (${current.pressure_mb} mb)` },
                        { label: "👁️ Visibility", value: `${current.vis_miles} miles (${current.vis_km} km)` },
                        { label: "🌧️ Precipitation", value: `${current.precip_mm} mm (${current.precip_in} in)` },
                        { label: "☁️ Cloud Cover", value: `${current.cloud}%` },
                        { label: "🌡️ Dew Point", value: `${current.dewpoint_c}°C (${current.dewpoint_f}°F)` },
                        {
                        label: "☀️ UV Index",
                        value: (
                            <Badge className={`text-sm px-2 py-1 ${getUVClasses(current.uv)}`}>
                            {current.uv} - {getUVDescription(current.uv)}
                            </Badge>
                        ),
                        },
                    ].map((item, index) => (
                        <div key={index} className="p-3 bg-sky-50 dark:bg-[#142738] rounded-lg shadow">
                        <strong className="text-[#1D3254] dark:text-sky-200">{item.label}:</strong>
                        <span className="ml-2 text-sky-700 dark:text-sky-300">{typeof item.value === "string" ? item.value : item.value}</span>
                        </div>
                    ))}

                    {current.gust_mph > 0 && (
                        <div className="p-3 bg-sky-50 dark:bg-[#142738] rounded-lg shadow sm:col-span-2">
                        <strong className="text-[#1D3254] dark:text-sky-200">🌬️ Wind Gusts:</strong>
                        <span className="ml-2 text-sky-700 dark:text-sky-300">{current.gust_mph} mph ({current.gust_kph} kph)</span>
                        </div>
                    )}
                    </div>
                </div>
                </CardContent>

                <CardFooter className="text-center text-xs text-sky-600 dark:text-sky-300 p-4 bg-sky-100 dark:bg-[#102A43] border-t border-sky-200 dark:border-slate-700">
                    <div>
                        Weather data last updated: {current.last_updated}
                    </div>
                    <div className="mt-1"> {/* Adds a small top margin for better visual separation */}
                        Powered by <a href="https://www.weatherapi.com/" title="Free Weather API" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#F5A623] dark:hover:text-yellow-400">WeatherAPI.com</a>
                    </div>
                </CardFooter>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader className="flex flex-col justify-center items-center">
                    <CardTitle className="bg-[#1D3254] text-white text-2xl text-center rounded-2xl px-4 py-2"> {/* Added some padding for better looks */}
                        Forecast
                    </CardTitle>
                    <CardDescription className="mt-2"> {/* Added some margin for spacing */}
                        3 Day Forecast
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center gap-2">
                    {forecast.forecastday.map((day, index) => {
                        return ( // <--- Added explicit return statement
                            <Card key={index} className="max-w-[200px]">
                                <CardHeader>
                                    <CardTitle className="bg-[#1D3254] text-white p-2 rounded-2xl text-center">Forecast</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Max Temp: {day.day.maxtemp_c}°C</p> {/* Example */}
                                    <p>Condition: {day.day.condition.text}</p> {/* Example */}
                                </CardContent>
                                <CardFooter>
                                    <p>More info for {day.date}</p> {/* Example */}
                                </CardFooter>
                            </Card>
                        );
                    })}
                </CardContent>
                <CardFooter>
                    <p>Card Footer</p>
                </CardFooter>
            </Card>

        </div>
        <div>
            test2
        </div>
    </div>
  );
}

export default MainPage;