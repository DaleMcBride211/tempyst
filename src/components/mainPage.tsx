'use client'
import React, { useState, useEffect, useCallback } from 'react';

// Importing UI components from a library, likely Shadcn UI based on naming conventions.
// These components provide a consistent and accessible design system.
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
} from "@/components/ui/carousel";
import { MapPin, Search } from 'lucide-react'; // Icons from the Lucide library

// --- Type Definitions ---
// Interfaces define the shape of the data objects fetched from the weather API.
// This improves type safety and code readability in a TypeScript project.

interface LocationData {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch?: number;
    localtime?: string;
}

interface LocationSuggestion {
    id: number;
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    url: string;
}

interface CurrentWeatherData {
    last_updated_epoch: number;
    last_updated: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: {
        text: string;
        icon: string;
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
    text: string;
    icon: string;
    code: number;
}

interface AstroData {
    sunrise: string;
    sunset: string;
    moonrise: string;
    moonset: string;
    moon_phase: string;
    moon_illumination: number;
    is_moon_up: number;
    is_sun_up: number;
}

interface DayData {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_mph: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    totalprecip_in: number;
    totalsnow_cm: number;
    avgvis_km: number;
    avgvis_miles: number;
    avghumidity: number;
    daily_will_it_rain: number;
    daily_chance_of_rain: number;
    daily_will_it_snow: number;
    daily_chance_of_snow: number;
    condition: WeatherCondition;
    uv: number;
}

interface HourData {
    time_epoch: number;
    time: string;
    temp_c: number;
    temp_f: number;
    is_day: number;
    condition: WeatherCondition;
    wind_mph: number;
    wind_kph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    pressure_in: number;
    precip_mm: number;
    precip_in: number;
    snow_cm: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    windchill_c: number;
    windchill_f: number;
    heatindex_c: number;
    heatindex_f: number;
    dewpoint_c: number;
    dewpoint_f: number;
    will_it_rain: number;
    chance_of_rain: number;
    will_it_snow: number;
    chance_of_snow: number;
    vis_km: number;
    vis_miles: number;
    gust_mph: number;
    gust_kph: number;
    uv: number;
    short_rad: number;
    diff_rad: number;
}

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
        forecastday: ForecastDay[];
    };
}

// --- Helper Functions ---

/**
 * Determines the Tailwind CSS classes for a UV index badge based on the UV value.
 * @param {number} uv - The UV index.
 * @returns {string} Tailwind CSS class string.
 */
const getUVClasses = (uv: number): string => {
    if (uv <= 2) return "bg-[#4A90E2] text-white"; // Low
    if (uv <= 5) return "bg-[#F5A623] text-black"; // Moderate
    if (uv <= 7) return "bg-orange-500 text-white"; // High
    if (uv <= 10) return "bg-red-600 text-white"; // Very High
    return "bg-purple-700 text-white"; // Extreme
};

/**
 * Returns a descriptive string for a given UV index.
 * @param {number} uv - The UV index.
 * @returns {string} The UV description (e.g., "Low", "Moderate").
 */
const getUVDescription = (uv: number): string => {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
};


function MainPage() {
    // --- State Hooks ---
    const [data, setData] = useState<WeatherApiResponse | null>(null); // Stores the main weather data
    const [loading, setLoading] = useState<boolean>(true); // Manages the loading state
    const [error, setError] = useState<string | null>(null); // Stores any error messages
    const [selectedDay, setSelectedDay] = useState<ForecastDay | null>(null); // Tracks the currently selected day in the forecast
    const apiKey = process.env.NEXT_PUBLIC_API_KEY; // Retrieves API key from environment variables
    const [query, setQuery] = useState(''); // Stores the user's search query for locations
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]); // Stores location suggestions from the API

    // --- Data Fetching Logic ---

    /**
     * Fetches weather data for a given location.
     * This function is wrapped in useCallback to prevent unnecessary re-creations,
     * which is good practice for functions passed as props to child components or
     * used in useEffect dependencies.
     * @param {string} location - The location query (city name or "lat,lon").
     */
    const fetchWeatherData = useCallback(async (location: string) => {
        if (!apiKey) {
            console.error("API key is missing.");
            setError("Configuration error: API key is missing. Please set NEXT_PUBLIC_API_KEY.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Fetching weather data from the WeatherAPI forecast endpoint.
            const res = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=3&aqi=no&alerts=no`);
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(`HTTP error! status: ${res.status}. ${errorData.error?.message || ''}`);
            }
            const result: WeatherApiResponse = await res.json();
            setData(result);
            // Automatically select the first day's forecast to display by default.
            if (result.forecast && result.forecast.forecastday.length > 0) {
                setSelectedDay(result.forecast.forecastday[0]);
            }
            console.log("Data fetched successfully for " + location + ":", result);
        } catch (e) {
            // Graceful error handling for fetch failures.
            if (e instanceof Error) {
                console.error("Failed to fetch data:", e);
                setError(e.message || "An unknown error occurred while fetching weather data.");
            } else if (typeof e === 'string') {
                console.error("Failed to fetch data:", e);
                setError(e);
            } else {
                console.error("Failed to fetch data:", e);
                setError("An unknown error occurred while fetching weather data.");
            }
        } finally {
            setLoading(false);
        }
    }, [apiKey]);

    // --- Effects ---

    /**
     * This effect runs once on component mount to get the user's current location
     * using the Geolocation API.
     * If successful, it fetches weather data for the current coordinates.
     * If it fails (e.g., user denies permission or API is not supported), it falls
     * back to fetching weather for a default location ("New York").
     */
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchWeatherData(`${latitude},${longitude}`);
                },
                (err) => {
                    console.warn(`Geolocation error (${err.code}): ${err.message}`);
                    console.log("Falling back to default location 'New York'.");
                    fetchWeatherData('New York');
                }
            );
        } else {
            console.warn("Geolocation is not supported by this browser. Falling back to default 'New York'.");
            fetchWeatherData('New York');
        }
    }, [fetchWeatherData]);

    /**
     * This effect handles fetching location suggestions as the user types in the search bar.
     * It uses a debounce pattern (setTimeout) to delay the API call, which prevents
     * excessive requests for every keystroke.
     */
    useEffect(() => {
        if (query.trim().length < 2) {
            setSuggestions([]); // Clear suggestions if the query is too short
            return;
        }

        const fetchSuggestions = async () => {
            try {
                const res = await fetch(`https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${query}`);
                if (res.ok) {
                    const suggestionsData: LocationSuggestion[] = await res.json();
                    setSuggestions(suggestionsData);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error("Failed to fetch suggestions:", error);
                setSuggestions([]);
            }
        };

        const handler = setTimeout(() => {
            fetchSuggestions();
        }, 500); // 500ms debounce delay

        // Cleanup function to clear the timeout if the component unmounts
        // or if the query changes before the timeout fires.
        return () => {
            clearTimeout(handler);
        };
    }, [query, apiKey]);

    /**
     * Handles the click event for a location suggestion.
     * It clears the search input and suggestions, then fetches weather data for the selected location.
     * @param {string} locationName - The name of the location to fetch weather for.
     */
    const handleSuggestionClick = (locationName: string) => {
        setQuery('');
        setSuggestions([]);
        fetchWeatherData(locationName);
    };

    // --- Conditional Rendering ---

    // Display a loading message while data is being fetched.
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-sky-50 dark:bg-[#0D1A2B]">
                <p className="text-xl text-[#1D3254] dark:text-sky-100">Loading weather data... ⏳</p>
            </div>
        );
    }

    // Display an error card if data fetching fails.
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

    // Display a "no data" message if the API returns no data.
    if (!data || !data.location || !data.current) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-sky-50 dark:bg-[#0D1A2B]">
                <p className="text-[#1D3254] dark:text-sky-100">No weather data available. Please try again later or check the location.</p>
            </div>
        );
    }

    // De-structure data for easier access.
    const { location, current, forecast } = data;
    // Fix for the weather icon URL which sometimes starts with '//'.
    const weatherIconUrl = current.condition.icon.startsWith('//')
        ? `https:${current.condition.icon}`
        : current.condition.icon;

    // --- Main Component Structure (JSX) ---

    return (
        <div className="container mx-auto p-4 flex flex-col min-h-screen bg-sky-50 dark:bg-[#0D1A2B] gap-2">

            {/* --- Location Search and Display --- */}
            <div className="flex-grow flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                <div className="flex items-center">
                    <MapPin size={20} className="mr-2" />
                    <span className="text-lg font-medium">{location.name}</span>
                </div>
                <div className="relative w-full max-w-xs">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="search"
                        placeholder="Search city..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 rounded-md text-gray-900 bg-white/90 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
                    />
                    {suggestions.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                            <ul>
                                {suggestions.map((suggestion) => (
                                    <li
                                        key={suggestion.id}
                                        onClick={() => handleSuggestionClick(suggestion.name)}
                                        className="px-4 py-2 cursor-pointer hover:bg-sky-100 dark:hover:bg-slate-600 text-gray-900 dark:text-gray-200"
                                    >
                                        {suggestion.name}, {suggestion.region}, {suggestion.country}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Main Weather Card (Current Conditions) --- */}
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

                            {/* Current Weather Details (Icon, Temp) */}
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

                            {/* Additional Weather Metrics */}
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

                    {/* Card Footer for data attribution */}
                    <CardFooter className="text-center text-xs text-sky-600 dark:text-sky-300 p-4 bg-sky-100 dark:bg-[#102A43] border-t border-sky-200 dark:border-slate-700">
                        <div>
                            Weather data last updated: {current.last_updated}
                        </div>
                        <div className="mt-1">
                            Powered by <a href="https://www.weatherapi.com/" title="Free Weather API" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#F5A623] dark:hover:text-yellow-400">WeatherAPI.com</a>
                        </div>
                    </CardFooter>
                </Card>
            </div>

            {/* --- 3-Day Forecast Cards --- */}
            <div>
                <Card>
                    <CardHeader className="flex flex-col justify-center items-center">
                        <CardTitle className="bg-[#1D3254] text-white text-2xl text-center rounded-2xl px-4 py-2">
                            Forecast
                        </CardTitle>
                        <CardDescription className="mt-2">
                            Select a day to see the hourly forecast
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row justify-center items-stretch gap-2">
                        {forecast.forecastday.map((day, index) => {
                            const isSelected = selectedDay?.date_epoch === day.date_epoch;
                            return (
                                <Card
                                    key={index}
                                    className={`w-full sm:max-w-[200px] cursor-pointer flex flex-col transition-all duration-200 ${isSelected ? 'border-sky-500 border-2 scale-105' : 'border-transparent'}`}
                                    onClick={() => setSelectedDay(day)}
                                >
                                    <CardHeader className="text-center">
                                        <CardTitle className="text-lg">
                                            {new Date(day.date_epoch * 1000).toLocaleDateString([], { weekday: 'short' })}
                                        </CardTitle>
                                        <CardDescription>
                                            {new Date(day.date_epoch * 1000).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow text-center">
                                        <img
                                            src={`https:${day.day.condition.icon}`}
                                            alt={day.day.condition.text}
                                            className="w-16 h-16 mx-auto"
                                            width="64"
                                            height="64"
                                        />
                                        <p className="font-semibold text-lg">{day.day.maxtemp_f}°F</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{day.day.mintemp_f}°F</p>
                                    </CardContent>
                                    <CardFooter className="flex justify-center text-center text-xs">
                                        <p>{day.day.condition.text}</p>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </CardContent>
                </Card>
            </div>

            {/* --- Hourly Forecast Carousel --- */}
            <div>
                {selectedDay ? (
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle className="text-xl text-center">
                                Hourly Forecast for {new Date(selectedDay.date_epoch * 1000).toLocaleDateString([], { weekday: 'long' })}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Carousel opts={{ align: "start" }} className="w-full">
                                <CarouselContent>
                                    {selectedDay.hour.map((hour, index) => (
                                        <CarouselItem key={index} className="pt-1 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                                            <div className="p-1">
                                                <Card className="text-center">
                                                    <CardHeader className="p-2">
                                                        <CardTitle className="text-sm font-medium">{new Date(hour.time_epoch * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent className="flex flex-col items-center p-2">
                                                        <img src={`https:${hour.condition.icon}`} alt={hour.condition.text} className="w-12 h-12" />
                                                        <p className="font-bold text-lg">{hour.temp_f}°F</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">{hour.condition.text}</p>
                                                        <p className="text-xs text-sky-600 dark:text-sky-400 mt-1">💧{hour.chance_of_rain}%</p>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious className="hidden sm:flex" />
                                <CarouselNext className="hidden sm:flex" />
                            </Carousel>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="text-center p-8">
                        <p className="text-slate-500 dark:text-slate-400">Select a day above to see the hourly forecast.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MainPage;