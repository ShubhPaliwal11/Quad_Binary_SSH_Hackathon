import React, { useState } from "react";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { MapPin, Phone, Clock, Navigation, Search, Map as MapIcon, Target, Loader2 } from "lucide-react";

// Mock Jan Aushadhi Kendra data
const MOCK_JAN_AUSHADHI_KENDRAS = [
  {
    id: 1,
    name: "Jan Aushadhi Kendra - Civil Hospital",
    address: "Civil Hospital Campus, AB Road, Indore, Madhya Pradesh 452001",
    phone: "+91 731 2545678",
    distance: "1.2 km",
    openTime: "8:00 AM - 8:00 PM",
    status: "Open Now",
    coordinates: { lat: 22.7196, lng: 75.8577 }
  },
  {
    id: 2,
    name: "Pradhan Mantri Jan Aushadhi Kendra",
    address: "Shop No. 5, Near Bombay Hospital, Indore, Madhya Pradesh 452010",
    phone: "+91 731 4056789",
    distance: "2.5 km",
    openTime: "9:00 AM - 9:00 PM",
    status: "Open Now",
    coordinates: { lat: 22.7243, lng: 75.8647 }
  },
  {
    id: 3,
    name: "Jan Aushadhi Kendra - MY Hospital",
    address: "MY Hospital Campus, MG Road, Indore, Madhya Pradesh 452001",
    phone: "+91 731 2567890",
    distance: "3.8 km",
    openTime: "8:00 AM - 8:00 PM",
    status: "Open Now",
    coordinates: { lat: 22.7156, lng: 75.8672 }
  },
  {
    id: 4,
    name: "Jan Aushadhi Generic Store",
    address: "123 Vijay Nagar, Near Square Mall, Indore, Madhya Pradesh 452010",
    phone: "+91 731 4987654",
    distance: "4.2 km",
    openTime: "8:30 AM - 8:30 PM",
    status: "Open Now",
    coordinates: { lat: 22.7532, lng: 75.8937 }
  },
  {
    id: 5,
    name: "Pradhan Mantri Bhartiya Jan Aushadhi Kendra",
    address: "Rajwada Square, Near Holkar Palace, Indore, Madhya Pradesh 452002",
    phone: "+91 731 2456123",
    distance: "5.1 km",
    openTime: "9:00 AM - 7:00 PM",
    status: "Closes Soon",
    coordinates: { lat: 22.7195, lng: 75.8573 }
  },
  {
    id: 6,
    name: "Jan Aushadhi Kendra - Palasia",
    address: "45 Palasia Square, Indore, Madhya Pradesh 452001",
    phone: "+91 731 4023456",
    distance: "6.3 km",
    openTime: "8:00 AM - 9:00 PM",
    status: "Open Now",
    coordinates: { lat: 22.7242, lng: 75.8736 }
  }
];

const frostedCardClass =
  "rounded-3xl border border-white/45 bg-gradient-to-br from-white/85 via-white/50 to-white/25 backdrop-blur-xl shadow-[0_30px_80px_rgba(59,130,246,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_36px_96px_rgba(59,130,246,0.24)]";

export default function JanAushadhiFinder() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  const medicines = location.state?.medicines || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const filteredKendras = MOCK_JAN_AUSHADHI_KENDRAS.filter(kendra =>
    kendra.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    kendra.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openGoogleMaps = (coordinates: { lat: number; lng: number }) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`, '_blank');
  };

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLocationLoading(false);
      },
      (error) => {
        let errorMessage = "Unable to get your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable location access in your browser.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        setLocationError(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Generate map URL based on user location or default location
  const getMapUrl = () => {
    if (userLocation) {
      // Center map on user's location with markers for Jan Aushadhi Kendras
      return `https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d29435.446368967624!2d${userLocation.lng}!3d${userLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sJan%20Aushadhi%20Kendra!5e0!3m2!1sen!2sin!4v${Date.now()}`;
    }
    // Default: Indore, Madhya Pradesh
    return "https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d58870.89273793524!2d75.8577!3d22.7196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sJan%20Aushadhi%20Kendra%20Indore!5e0!3m2!1sen!2sin!4v1234567890";
  };

  return (
    <div className="dashboard-page min-h-screen bg-gradient-to-br from-white via-[#f8fbff] to-[#eef2ff]">
      <FloatingSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-72"} p-6`}>
        <div className="mx-auto w-full max-w-6xl px-6 pb-16">
          {/* Header */}
          <header className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              ← Back to Consultations
            </Button>
            <h1 className="dashboard-title text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
              Find Jan Aushadhi Kendra Near You
            </h1>
            <p className="dashboard-text text-gray-600 text-base md:text-lg">
              Get affordable generic medicines at government-approved Jan Aushadhi stores
            </p>
          </header>

          {/* Prescribed Medicines Section */}
          {medicines.length > 0 && (
            <Card className={`${frostedCardClass} mb-6`}>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Your Prescribed Medicines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {medicines.map((medicine: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{medicine.name}</p>
                        <p className="text-sm text-gray-600">{medicine.dosage} - {medicine.frequency}</p>
                        <p className="text-xs text-gray-500">Duration: {medicine.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by location or store name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </div>

          {/* Interactive Map */}
          <Card className={`${frostedCardClass} mb-6 overflow-hidden`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    Jan Aushadhi Kendras in Your Area
                  </CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    📍 {filteredKendras.length} stores found nearby
                    {userLocation && " • Centered on your location"}
                  </p>
                </div>
                <Button
                  onClick={requestUserLocation}
                  disabled={locationLoading}
                  variant={userLocation ? "outline" : "default"}
                  size="sm"
                  className="flex-shrink-0"
                >
                  {locationLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Getting Location...
                    </>
                  ) : userLocation ? (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Update Location
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 mr-2" />
                      Use My Location
                    </>
                  )}
                </Button>
              </div>
              {locationError && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs text-red-600">{locationError}</p>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full h-[400px] md:h-[500px]">
                <iframe
                  key={userLocation ? `${userLocation.lat}-${userLocation.lng}` : 'default'}
                  src={getMapUrl()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-b-3xl"
                  title="Jan Aushadhi Kendra Map"
                ></iframe>
              </div>
              <div className="px-6 py-4 bg-blue-50/30 border-t border-blue-100/50">
                <p className="text-sm text-gray-600 text-center">
                  <Navigation className="w-4 h-4 inline mr-1" />
                  Click "Get Directions" on any store below for turn-by-turn navigation
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Jan Aushadhi Kendra List */}
          <div className="space-y-4">
            {filteredKendras.map((kendra) => (
              <Card key={kendra.id} className={`${frostedCardClass} overflow-hidden`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {kendra.name}
                          </h3>
                          <Badge 
                            variant={kendra.status === "Open Now" ? "default" : "secondary"}
                            className="mt-1"
                          >
                            {kendra.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{kendra.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-blue-500" />
                          <span>{kendra.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>{kendra.openTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-end gap-3 md:min-w-[160px]">
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Distance</p>
                        <p className="text-2xl font-bold text-blue-600">{kendra.distance}</p>
                      </div>
                      <Button 
                        onClick={() => openGoogleMaps(kendra.coordinates)}
                        className="w-full md:w-auto"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.open(`tel:${kendra.phone}`, '_self')}
                        className="w-full md:w-auto"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Store
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredKendras.length === 0 && (
            <Card className={frostedCardClass}>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500 text-lg">No Jan Aushadhi Kendras found matching your search.</p>
              </CardContent>
            </Card>
          )}

          {/* Info Section */}
          <Card className={`${frostedCardClass} mt-8`}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About Jan Aushadhi Kendra</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Jan Aushadhi Kendras provide quality generic medicines at affordable prices (50-90% cheaper than branded medicines)</p>
                <p>• All medicines are approved by the Government of India and meet quality standards</p>
                <p>• These stores are part of Pradhan Mantri Bhartiya Jan Aushadhi Pariyojana (PMBJP)</p>
                <p>• No prescription required for over-the-counter medicines, but bring your prescription for scheduled drugs</p>
                <p>• Most stores accept cash, UPI, and card payments</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
