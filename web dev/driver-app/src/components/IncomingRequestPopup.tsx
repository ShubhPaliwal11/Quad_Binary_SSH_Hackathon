import { Phone, CheckCircle2 } from "lucide-react";

interface IncomingRequestProps {
    request: {
        id: string;
        pickup_text: string;
    };
    onAccept: (requestId: string) => void;
}

export function IncomingRequestPopup({ request, onAccept }: IncomingRequestProps) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="bg-red-600 p-6 text-center text-white relative">
                    <div className="absolute inset-0 bg-red-600 animate-pulse opacity-50"></div>
                    <Phone className="w-12 h-12 mx-auto mb-3 animate-bounce relative z-10" />
                    <h2 className="text-2xl font-bold relative z-10 tracking-wider">NEW EMERGENCY</h2>
                </div>

                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-1 font-medium uppercase tracking-wider">Pickup Location</p>
                    <p className="text-xl font-semibold text-gray-900 mb-8 border-l-4 border-red-500 pl-3">
                        {request.pickup_text}
                    </p>

                    <button
                        onClick={() => onAccept(request.id)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-green-500/30"
                    >
                        <CheckCircle2 className="w-6 h-6" />
                        ACCEPT EMERGENCY
                    </button>
                </div>
            </div>
        </div>
    );
}
