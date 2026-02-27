import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { IncomingRequestPopup } from './components/IncomingRequestPopup';
// import { supabase } from './lib/supabase'; // Will use later for real connection
import { Activity, BellRing } from 'lucide-react';

// Mock types
type RequestType = { id: string; pickup_text: string } | null;

function App() {
  const [driverId, setDriverId] = useState<string | null>(null);
  const [activeRequest, setActiveRequest] = useState<RequestType>(null);
  const [assignedRequest, setAssignedRequest] = useState<string | null>(null);

  // Auto-simulate a request coming in 5 seconds after login for demo purposes
  useEffect(() => {
    if (driverId && !activeRequest && !assignedRequest) {
      const timer = setTimeout(() => {
        setActiveRequest({
          id: 'rq' + Math.floor(Math.random() * 1000),
          pickup_text: 'ABC Market, near Central Park'
        });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [driverId, activeRequest, assignedRequest]);

  const handleLogin = (phone: string) => {
    // Mock login /driver/login
    console.log('Logging in driver with phone:', phone);
    setDriverId('d101'); // Mock driver ID
  };

  const handleAccept = async (requestId: string) => {
    // Mock /driver/accept-request API
    console.log('Accepting request:', { driver_id: driverId, request_id: requestId });

    // Simulate API call
    setActiveRequest(null);
    setAssignedRequest(requestId);

    // In a real app we'd navigate or show trip status, but per rules: excludes navigation,trip_status
    alert("Emergency Accepted! (Trip Status & Navigation Excluded per requirements)");

    // Auto reset for demo
    setTimeout(() => setAssignedRequest(null), 3000);
  };

  // 1. Auth Flow
  if (!driverId) {
    return <Login onLogin={handleLogin} />;
  }

  // 2. Main Idle State
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Activity className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 leading-tight">Driver Active</h1>
              <p className="text-xs text-green-600 font-medium">Online & Ready</p>
            </div>
          </div>
          <button onClick={() => setDriverId(null)} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content (Idle) */}
      <main className="max-w-md mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
          <BellRing className="w-12 h-12 text-blue-500 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Waiting for Emergencies</h2>
        <p className="text-gray-500 text-center max-w-[250px] leading-relaxed">
          Keep the app open. You will be notified instantly when a nearby request arrives.
        </p>
      </main>

      {/* 3. Incoming Request Popup Overlay */}
      {activeRequest && (
        <IncomingRequestPopup
          request={activeRequest}
          onAccept={handleAccept}
        />
      )}
    </div>
  );
}

export default App;
