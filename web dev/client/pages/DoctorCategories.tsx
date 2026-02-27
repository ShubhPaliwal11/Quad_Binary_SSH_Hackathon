import React, { useState } from "react";
import { FloatingSidebar } from "@/components/FloatingSidebar";
import { useSidebar } from "@/contexts/SidebarContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { Baby, Smile, Heart, Stethoscope, Users, Bone, Calendar, Clock, MapPin, FileText, Star, Video, User, Pill, ArrowRight } from "lucide-react";
import { MOCK_PAST_CONSULTATIONS } from "@/lib/mockAppointmentData";

const frostedCardClass =
  "rounded-3xl border border-white/45 bg-gradient-to-br from-white/85 via-white/50 to-white/25 backdrop-blur-xl shadow-[0_30px_80px_rgba(59,130,246,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_36px_96px_rgba(59,130,246,0.24)]";

const CATEGORIES: { slug: string; name: string; desc: string; icon: React.ComponentType<any>; color: string; bgGradient: string }[] = [
  {
    slug: "pediatrician",
    name: "Pediatrician",
    desc: "Child health & immunisation",
    icon: Baby,
    color: "text-pink-500",
    bgGradient: "from-pink-50 to-pink-100"
  },
  {
    slug: "dermatologist",
    name: "Dermatologist",
    desc: "Skin, hair and nails",
    icon: Smile,
    color: "text-orange-500",
    bgGradient: "from-orange-50 to-orange-100"
  },
  {
    slug: "cardiologist",
    name: "Cardiologist",
    desc: "Heart & vascular care",
    icon: Heart,
    color: "text-red-500",
    bgGradient: "from-red-50 to-red-100"
  },
  {
    slug: "general-physician",
    name: "General Physician",
    desc: "Primary care",
    icon: Stethoscope,
    color: "text-blue-500",
    bgGradient: "from-blue-50 to-blue-100"
  },
  {
    slug: "gynecologist",
    name: "Gynecologist",
    desc: "Women's health",
    icon: Users,
    color: "text-purple-500",
    bgGradient: "from-purple-50 to-purple-100"
  },
  {
    slug: "orthopedic",
    name: "Orthopedic",
    desc: "Bones & joints",
    icon: Bone,
    color: "text-amber-600",
    bgGradient: "from-amber-50 to-amber-100"
  },
];

export default function DoctorCategories() {
  const { isCollapsed, setIsCollapsed } = useSidebar();
  const navigate = useNavigate();

  return (
    <div className="dashboard-page min-h-screen bg-gradient-to-br from-white via-[#f8fbff] to-[#eef2ff]">
      <FloatingSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />


      <div className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-72"} p-6`}>
        <div className="mx-auto w-full max-w-6xl px-6 pb-16">
          <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="dashboard-title text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                ArogyaSaarthi – Find Doctors
              </h1>
              <p className="dashboard-text text-gray-600 text-base md:text-lg">
                Browse by specialisation and book appointments instantly.
              </p>
            </div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Doctors</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Categories</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Tabs Section */}
          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto md:mx-0 grid-cols-2 mb-6">
              <TabsTrigger value="categories" className="text-sm md:text-base">
                Find Doctors
              </TabsTrigger>
              <TabsTrigger value="consultations" className="text-sm md:text-base">
                Past Consultations
              </TabsTrigger>
            </TabsList>

            {/* Find Doctors Tab */}
            <TabsContent value="categories" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {CATEGORIES.map((cat) => {
                  const IconComponent = cat.icon;
                  return (
                    <Card
                      key={cat.slug}
                      className={`${frostedCardClass} overflow-hidden cursor-pointer hover:shadow-lg transition-all`}
                      onClick={() => navigate(`/dashboard/doctors/${cat.slug}`)}
                    >
                      {/* Image Section */}
                      <div className={`w-full h-40 bg-gradient-to-br ${cat.bgGradient} flex items-center justify-center relative overflow-hidden`}>
                        <div className="relative w-full h-full flex items-center justify-center">
                          <IconComponent className={`${cat.color} w-20 h-20 opacity-80`} />
                          <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent"></div>
                        </div>
                      </div>

                      {/* Content Section */}
                      <CardHeader className="pb-2">
                        <CardTitle className="dashboard-title text-lg font-semibold tracking-tight">
                          {cat.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-4">
                        <p className="text-sm text-muted-foreground">{cat.desc}</p>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => navigate(`/dashboard/doctors/${cat.slug}`)}
                        >
                          View Doctors
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Past Consultations Tab */}
            <TabsContent value="consultations" className="mt-0">
              <div className="space-y-4">
                {MOCK_PAST_CONSULTATIONS.map((consultation) => (
                  <Card key={consultation.id} className={`${frostedCardClass} overflow-hidden`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        {/* Left Section */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-500" />
                                {consultation.doctorName}
                              </h3>
                              <p className="text-sm text-gray-600 font-medium">{consultation.specialty}</p>
                            </div>
                            <Badge
                              variant={consultation.status === 'completed' ? 'default' : 'secondary'}
                              className="ml-2"
                            >
                              {consultation.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Calendar className="w-4 h-4 text-blue-500" />
                              <span>{consultation.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4 text-blue-500" />
                              <span>{consultation.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="w-4 h-4 text-blue-500" />
                              <span className="text-xs">{consultation.hospital}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              {consultation.consultationType === 'Video Call' ? (
                                <Video className="w-4 h-4 text-blue-500" />
                              ) : (
                                <User className="w-4 h-4 text-blue-500" />
                              )}
                              <span>{consultation.consultationType}</span>
                            </div>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-gray-200">
                            <div>
                              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Symptoms</p>
                              <p className="text-sm text-gray-600">{consultation.symptoms}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Diagnosis</p>
                              <p className="text-sm text-gray-600">{consultation.diagnosis}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Prescription</p>
                              <p className="text-sm text-gray-600">{consultation.prescription}</p>
                            </div>
                            {consultation.followUpDate && (
                              <div>
                                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Follow-up Date</p>
                                <p className="text-sm text-gray-600">{consultation.followUpDate}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right Section */}
                        <div className="flex flex-col items-end gap-3 md:min-w-[140px]">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < consultation.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Consultation Fee</p>
                            <p className="text-lg font-bold text-blue-600">{consultation.cost}</p>
                          </div>

                          {/* Dialog for View Details */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full">
                                <FileText className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">Consultation Details</DialogTitle>
                                <DialogDescription>
                                  Complete information about your consultation with {consultation.doctorName}
                                </DialogDescription>
                              </DialogHeader>

                              <div className="space-y-4 mt-4">
                                {/* Doctor & Consultation Info */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50/50 rounded-lg">
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Doctor</p>
                                    <p className="text-sm font-medium text-gray-900">{consultation.doctorName}</p>
                                    <p className="text-xs text-gray-600">{consultation.specialty}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Date & Time</p>
                                    <p className="text-sm font-medium text-gray-900">{consultation.date}</p>
                                    <p className="text-xs text-gray-600">{consultation.time}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Type</p>
                                    <p className="text-sm font-medium text-gray-900">{consultation.consultationType}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Fee</p>
                                    <p className="text-sm font-medium text-gray-900">{consultation.cost}</p>
                                  </div>
                                </div>

                                {/* Medical Details */}
                                <div className="space-y-3">
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Symptoms</p>
                                    <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{consultation.symptoms}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1">Diagnosis</p>
                                    <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{consultation.diagnosis}</p>
                                  </div>
                                </div>

                                {/* Prescribed Medicines */}
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <Pill className="w-5 h-5 text-blue-500" />
                                    <h3 className="text-lg font-semibold text-gray-900">Prescribed Medicines</h3>
                                  </div>
                                  <div className="space-y-2">
                                    {consultation.medicines && consultation.medicines.map((medicine: any, idx: number) => (
                                      <div key={idx} className="p-3 border border-gray-200 rounded-lg bg-white">
                                        <div className="flex justify-between items-start">
                                          <div>
                                            <p className="font-semibold text-gray-900">{medicine.name}</p>
                                            <p className="text-sm text-gray-600 mt-1">
                                              <span className="font-medium">Dosage:</span> {medicine.dosage}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                              <span className="font-medium">Frequency:</span> {medicine.frequency}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                              <span className="font-medium">Duration:</span> {medicine.duration}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Jan Aushadhi Button */}
                                {consultation.medicines && consultation.medicines.length > 0 && (
                                  <div className="pt-4 border-t border-gray-200">
                                    <Button
                                      onClick={() => navigate('/dashboard/jan-aushadhi-finder', { state: { medicines: consultation.medicines } })}
                                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                      size="lg"
                                    >
                                      <MapPin className="w-5 h-5 mr-2" />
                                      Find These Medicines in Nearest Jan Aushadhi Kendra
                                      <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                    <p className="text-xs text-center text-gray-500 mt-2">
                                      Get generic medicines at 50-90% lower prices
                                    </p>
                                  </div>
                                )}

                                {consultation.followUpDate && (
                                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Follow-up Required</p>
                                    <p className="text-sm text-gray-900 font-medium mt-1">{consultation.followUpDate}</p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
