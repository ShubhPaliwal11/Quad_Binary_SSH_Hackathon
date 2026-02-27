import { Bluetooth, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { requestDevice, getBandMac, authenticate, authKeyStringToKey, BluetoothDeviceWrapper } from "../../../miband/band-connection";
import { useMiBand } from "../../../miband/MiBandContext";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Watch } from 'lucide-react';

export function ConnectDeviceCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [nickname, setNickname] = useState('');
  // Use user-requested hardcoded default auth key
  const [authKey, setAuthKey] = useState('1a158db97c9f1dad8e067e7ff3c6e595');
  const [step, setStep] = useState<'input' | 'connecting' | 'success'>('input');
  const [loadingState, setLoadingState] = useState<'reauthorizing' | 'searching' | 'connecting' | 'getting-service' | 'authenticating' | 'ready' | null>(null);
  const [error, setError] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const { addAuthorizedDevice, addBand, bands } = useMiBand();
  const { toast } = useToast();

  const handleOpenClick = () => {
    setIsOpen(true);
    setStep('input');
    setError('');
  };

  const handleConnect = async () => {
    if (!nickname.trim()) {
      setError('Please enter a nickname for your device');
      return;
    }
    if (!authKey.trim() || authKey.length !== 32) {
      setError('Auth key must be 32 characters (16 bytes in hex)');
      return;
    }

    setLoading(true);
    setError('');
    setStep('connecting');
    setLoadingState('searching');

    try {
      // 1. Request Bluetooth device interactively
      const rawDevice = await requestDevice();
      if (!rawDevice) {
        throw new Error('No device selected');
      }

      toast({
        title: "Connecting",
        description: "Please tap the button on your Mi Band to confirm connection...",
        duration: 5000,
      });

      // 2. Extract MAC address
      setLoadingState('connecting');
      const mac = await getBandMac(rawDevice, {
        onConnecting: () => setLoadingState('connecting'),
        onGettingService: () => setLoadingState('getting-service'),
        onGettingCharacteristic: () => { },
        onReadingValue: () => { }
      });

      if (!mac) {
        throw new Error('Failed to get device MAC address');
      }

      setMacAddress(mac);

      // 3. Define the band data properly
      const bandData = {
        nickname: nickname.trim(),
        macAddress: mac,
        authKey: authKey.trim(),
        deviceId: rawDevice.id
      };

      // 4. Authenticate
      const wrapper = new BluetoothDeviceWrapper(rawDevice);
      const key = await authKeyStringToKey(bandData.authKey);
      await authenticate(wrapper, key, {
        onSearching: () => setLoadingState('searching'),
        onConnecting: () => setLoadingState('connecting'),
        onGettingService: () => setLoadingState('getting-service'),
        onAuthenticating: () => setLoadingState('authenticating'),
      });

      await addBand(bandData);
      addAuthorizedDevice(rawDevice);

      setLoadingState('ready');
      setStep('success');

      toast({
        title: "Connected!",
        description: `Successfully connected to ${nickname}.`,
        variant: "default",
      });

      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to connect to device");
      setLoading(false);
      // Wait a moment so user can see error in stepper before falling back
      setTimeout(() => setStep('input'), 3000);

      toast({
        title: "Connection Failed",
        description: err instanceof Error ? err.message : "Failed to connect",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // Reset state for next open
    setNickname('');
    setStep('input');
    setLoadingState(null);
    setLoading(false);
    setError('');
    setMacAddress('');
  };

  return (
    <>
      <div
        onClick={handleOpenClick}
        className="bg-dark-primary rounded-[24px] p-6 shadow-lg shadow-black/10 flex flex-col relative overflow-hidden group cursor-pointer active:scale-[0.99] transition-all"
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-lime-primary/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-lime-primary/20 transition-colors duration-500"></div>

        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="w-10 h-10 rounded-full bg-lime-primary flex items-center justify-center text-dark-primary">
            <Bluetooth className="w-5 h-5" />
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">New Device</span>
          </div>
        </div>

        <div className="mb-8 relative z-10">
          <h3 className="text-xl font-bold text-white mb-2 leading-tight">
            Connect your <br /> fitness band
          </h3>
          <p className="text-xs text-white/60 leading-relaxed max-w-[180px]">
            Sync your latest health data and activity metrics automatically.
          </p>
        </div>

        <div className="relative h-24 mb-6 flex items-center justify-center">
          {/* Simplified Fitness Band Illustration */}
          <div className="relative w-16 h-24 bg-gray-800 rounded-2xl border-2 border-gray-700 shadow-2xl transform -rotate-12 group-hover:rotate-0 transition-transform duration-500">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-14 bg-black rounded-lg overflow-hidden border border-gray-600">
              <div className="w-full h-1 bg-lime-primary animate-pulse"></div>
              <div className="p-1 flex flex-col gap-1">
                <div className="w-full h-0.5 bg-white/20 rounded"></div>
                <div className="w-2/3 h-0.5 bg-white/20 rounded"></div>
              </div>
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-700 border border-gray-600"></div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/4 w-2 h-2 bg-lime-primary rounded-full animate-ping"></div>
          <div className="absolute bottom-4 right-1/4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
        </div>

        <button
          className="w-full bg-lime-primary hover:bg-[#e6ff80] text-dark-primary font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] relative z-10 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          <span>Connect Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* The identical AddBand modal from MiBand.tsx architecture */}
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Watch className="w-5 h-5 text-gray-900" />
              <span className="text-gray-900">
                {step === 'input' ? 'Connect New Device' : step === 'connecting' ? 'Connecting...' : 'Success!'}
              </span>
            </DialogTitle>
            <DialogDescription>
              {step === 'input' ? 'Enter your Mi Band details to connect. We have pre-filled the default Auth Key.' :
                step === 'connecting' ? 'Connecting to your Mi Band...' :
                  'Device connected successfully!'}
            </DialogDescription>
          </DialogHeader>

          {step === 'input' && (
            <div className="space-y-4 py-4 text-left">
              <div className="space-y-2">
                <Label htmlFor="nickname" className="text-gray-700">Device Nickname</Label>
                <Input
                  id="nickname"
                  placeholder="e.g., My Mi Band"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  disabled={loading}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authKey" className="text-gray-700">Authentication Key</Label>
                <Input
                  id="authKey"
                  placeholder="32 character hex key (e.g., 0123456789abcdef...)"
                  value={authKey}
                  onChange={(e) => setAuthKey(e.target.value)}
                  disabled={loading}
                  maxLength={32}
                  className="font-mono text-sm bg-gray-50 border-gray-200 text-gray-900"
                />
                <p className="text-xs text-gray-500">
                  16 bytes in hexadecimal format (32 characters).
                </p>
              </div>

              {error && (
                <Alert className="border-red-500 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={handleClose} disabled={loading} className="flex-1 text-gray-700">
                  Cancel
                </Button>
                <Button onClick={handleConnect} disabled={loading} className="flex-1 bg-lime-primary hover:bg-[#c2e63b] text-dark-primary font-bold border-none">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    'Connect Device'
                  )}
                </Button>
              </div>
            </div>
          )}

          {step === 'connecting' && loadingState && (
            <div className="flex flex-col items-center justify-center py-4">
              <LoadingStepper currentState={loadingState} error={error} />
              {macAddress && (
                <p className="text-xs text-gray-500 mt-4 font-mono">{macAddress}</p>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-lime-primary/20 rounded-full flex items-center justify-center mb-4">
                <Activity className="h-8 w-8 text-lime-primary" />
              </div>
              <p className="text-lg font-semibold text-gray-900">Connected!</p>
              <p className="text-sm text-gray-600 mt-1">{nickname}</p>
              {macAddress && (
                <p className="text-xs text-gray-500 mt-2 font-mono">{macAddress}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

const LoadingStepper: React.FC<{ currentState: string; error?: string }> = ({ currentState, error }) => {
  const states = [
    { id: 'reauthorizing', text: 'Reauthorizing' },
    { id: 'searching', text: 'Searching for Device' },
    { id: 'connecting', text: 'Connecting' },
    { id: 'getting-service', text: 'Getting Service' },
    { id: 'authenticating', text: 'Authenticating' }
  ];

  const currentIndex = states.findIndex(s => s.id === currentState);

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-3">
      {states.map((state, index) => {
        const isCompleted = currentIndex === -1 && currentState === 'ready' ? true : index < currentIndex;
        const isCurrent = index === currentIndex;
        const hasError = isCurrent && error;

        return (
          <div
            key={state.id}
            className={`flex items-center w-full max-w-[280px] space-x-3 p-3 rounded-lg transition-all duration-300 ${isCurrent ? 'bg-lime-primary/10 border border-lime-primary/30' : 'opacity-50'}`}
          >
            <div className="flex-shrink-0">
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : hasError ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-lime-primary animate-spin" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
              )}
            </div>
            <span className={`text-sm font-medium ${isCurrent ? 'text-lime-700' : 'text-gray-500'}`}>
              {state.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};
