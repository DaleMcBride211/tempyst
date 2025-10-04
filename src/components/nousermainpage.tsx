import React from 'react';
// Importing UI components from a library, likely Shadcn UI.
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// Importing icons from the Lucide library.
import { MapPin, AlertTriangle, Thermometer } from 'lucide-react';
// Importing a custom component for the sign-in button.
import SignInButton from '@/components/signInButton'

/**
 * Renders the landing page for the Weather App.
 * This page is designed to showcase the app's features and encourage user sign-up.
 */
function WeatherAppLandingPage() {
    return (
        // Main container for the landing page with background and text colors from the theme.
        <div className="bg-background text-foreground">

            {/* --- Hero Section --- */}
            {/* A full-width section with a title, description, and call-to-action button. */}
            <section className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-5xl font-bold tracking-tight text-primary md:text-6xl">
                    Instant, Accurate Weather Forecasts
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Get real-time weather data, severe weather alerts, and personalized forecasts. Plan your day with confidence, no matter the weather.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    {/* The sign-in button component, likely handling authentication logic. */}
                    <SignInButton />
                </div>
            </section>

            {/* --- Features Section --- */}
            {/* A section showcasing the app's key features using Card components. */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-center">Your Personal Weather Hub</h2>
                <p className="text-muted-foreground text-center mt-2 mb-12">
                    All the essential weather information you need in one place.
                </p>
                {/* Grid layout for feature cards, adapting to different screen sizes. */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {/* Feature Card 1: Real-Time Forecasts */}
                    <Card>
                        <CardHeader>
                            <Thermometer className="h-8 w-8 text-primary" />
                            <CardTitle className="mt-4">Real-Time Forecasts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Access up-to-the-minute temperature, humidity, and wind speed data for any location.
                            </CardDescription>
                        </CardContent>
                    </Card>
                    {/* Feature Card 2: Severe Weather Alerts */}
                    <Card>
                        <CardHeader>
                            <AlertTriangle className="h-8 w-8 text-primary" />
                            <CardTitle className="mt-4">Severe Weather Alerts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Stay safe with timely notifications for storms, hail, and other extreme weather conditions.
                            </CardDescription>
                        </CardContent>
                    </Card>
                    {/* Feature Card 3: Save Favorite Locations */}
                    <Card>
                        <CardHeader>
                            <MapPin className="h-8 w-8 text-primary" />
                            <CardTitle className="mt-4">Save Favorite Locations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Sign up to save multiple locations and get instant weather updates for the places you care about most.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* --- Call-to-Action Section --- */}
            {/* A final section designed to be a strong call-to-action for signing up. */}
            <section className="bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 py-16 text-center">
                    <h2 className="text-3xl font-bold">Never Get Caught in the Rain</h2>
                    <p className="mt-2 mb-2">
                        Create a free account to unlock personalized alerts and save your favorite cities.
                    </p>
                    {/* The sign-in button component repeated for conversion. */}
                    <SignInButton />
                </div>
            </section>
        </div>
    );
}

export default WeatherAppLandingPage;