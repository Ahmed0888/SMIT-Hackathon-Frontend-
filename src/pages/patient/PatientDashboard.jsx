import { useAuth } from '../../context/AuthContext';

const PatientDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">My Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome, {user?.name}</p>
            </div>

            <div className="animate-fade-in rounded-2xl bg-gradient-to-r from-primary to-primary-light p-6 text-white shadow-sm">
                <h2 className="text-lg font-bold">Your Health Portal</h2>
                <p className="mt-1 text-sm text-white/80">View your medical records, prescriptions, and appointment history</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700">Profile Information</h3>
                    <div className="mt-4 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Name</span>
                            <span className="font-medium text-gray-800">{user?.name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Email</span>
                            <span className="font-medium text-gray-800">{user?.email}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Plan</span>
                            <span className={`font-semibold uppercase ${user?.plan === 'pro' ? 'text-primary' : 'text-gray-400'}`}>{user?.plan}</span>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-700">Quick Links</h3>
                    <div className="mt-4 space-y-2">
                        <a href="/patient/history" className="block rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors">
                            📋 View Medical History
                        </a>
                        <a href="/patient/history" className="block rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors">
                            💊 My Prescriptions
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;
