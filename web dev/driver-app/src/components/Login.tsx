import { useState } from "react";
import { Ambulance } from "lucide-react";

interface LoginProps {
    onLogin: (phone: string) => void;
}

export function Login({ onLogin }: LoginProps) {
    const [phone, setPhone] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length >= 10) {
            onLogin(phone);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 animate-in slide-in-from-bottom-8 duration-500 fade-in">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Ambulance className="w-10 h-10 text-red-600" />
                </div>

                <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Driver Portal</h1>
                <p className="text-center text-gray-500 mb-8">Enter your registered mobile number to continue</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</span>
                            <input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 text-lg font-medium transition-all outline-none"
                                placeholder="000 000 0000"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-600/30 transition-all hover:translate-y-[-2px] active:translate-y-[1px]"
                    >
                        Verify &amp; Login
                    </button>
                </form>
            </div>

            <p className="mt-8 text-sm text-gray-400 font-medium">© 2026 HealthSaarthi Partners</p>
        </div>
    );
}
