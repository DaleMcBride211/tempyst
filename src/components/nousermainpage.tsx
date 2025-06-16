import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, AlertTriangle, Thermometer } from 'lucide-react';
import SignInButton from '@/components/signInButton'

function WeatherAppLandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary md:text-6xl">
          Instant, Accurate Weather Forecasts
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Get real-time weather data, severe weather alerts, and personalized forecasts. Plan your day with confidence, no matter the weather.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <SignInButton />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center">Your Personal Weather Hub</h2>
        <p className="text-muted-foreground text-center mt-2 mb-12">
          All the essential weather information you need in one place.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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

      {/* Call to Action Section */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold">Never Get Caught in the Rain</h2>
          <p className="mt-2 mb-2">
            Create a free account to unlock personalized alerts and save your favorite cities.
          </p>
          <SignInButton />
        </div>
      </section>
    </div>
  );
}

export default WeatherAppLandingPage;