import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const roleRoutes = {
        admin: '/admin/dashboard',
        doctor: '/doctor/dashboard',
        receptionist: '/receptionist/dashboard',
        patient: '/patient/dashboard',
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const user = await login(email, password);
            toast.success(`Welcome back, ${user.name}!`);
            navigate(roleRoutes[user.role] || '/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Left Side — Branding */}
            <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-primary-dark via-primary to-primary-light p-12">
                <div className="max-w-md text-white">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold backdrop-blur-sm">
                        M
                    </div>
                    <h1 className="text-4xl font-bold leading-tight">
                        MediFlow
                    </h1>
                    <p className="mt-2 text-lg text-white/80">AI-Powered Clinic Management</p>
                    <div className="mt-8 space-y-4 text-sm text-white/70">
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">🏥</span>
                            Digital patient registration & records
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">🤖</span>
                            AI-powered symptom checker
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">📋</span>
                            Digital prescriptions with PDF download
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">📊</span>
                            Analytics dashboards for clinic insights
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side — Login Form */}
            <div className="flex w-full items-center justify-center px-6 lg:w-1/2">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="mb-8 text-center lg:hidden">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white">
                            M
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">MediFlow</h1>
                    </div>

                    <div className="rounded-2xl bg-white p-8 shadow-lg sm:p-10">
                        <h2 className="text-2xl font-bold text-gray-800">Sign in</h2>
                        <p className="mt-1 text-sm text-gray-500">Access your clinic dashboard</p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Email</label>
                                <div className="relative">
                                    <HiOutlineMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@clinic.com"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Password</label>
                                <div className="relative">
                                    <HiOutlineLockClosed className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        Signing in...
                                    </span>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>

                        <div className="mt-6 rounded-lg bg-gray-50 p-3 text-center text-xs text-gray-400">
                            Demo: <span className="font-medium text-gray-600">admin@mediflow.com</span> / <span className="font-medium text-gray-600">Admin@123</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
