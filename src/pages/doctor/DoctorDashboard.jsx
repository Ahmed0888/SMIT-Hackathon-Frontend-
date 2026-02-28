import { useEffect, useState } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiOutlineCalendar, HiOutlineClipboardList, HiOutlineDocumentText, HiOutlineBeaker } from 'react-icons/hi';

const DoctorDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [todayAppts, setTodayAppts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, apptsRes] = await Promise.all([
                    API.get(`/analytics/doctor/${user._id}`),
                    API.get(`/appointments?date=${new Date().toISOString().split('T')[0]}`),
                ]);
                setStats(statsRes.data.data);
                setTodayAppts(apptsRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user._id]);

    if (loading) return <LoadingSpinner text="Loading dashboard..." />;

    const cards = [
        { label: "Today's Appointments", value: stats?.todayAppointments || 0, icon: HiOutlineCalendar, color: 'bg-primary' },
        { label: 'Total Appointments', value: stats?.totalAppointments || 0, icon: HiOutlineClipboardList, color: 'bg-indigo-500' },
        { label: 'Prescriptions', value: stats?.totalPrescriptions || 0, icon: HiOutlineDocumentText, color: 'bg-amber-500' },
        { label: 'AI Diagnoses', value: stats?.totalDiagnosis || 0, icon: HiOutlineBeaker, color: 'bg-purple-500' },
    ];

    const statusColors = { pending: 'bg-amber-100 text-amber-700', confirmed: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome, Dr. {user?.name}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <div key={card.label} className="animate-fade-in rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{card.label}</p>
                                <p className="mt-1 text-3xl font-bold text-gray-800">{card.value}</p>
                            </div>
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color} text-white`}>
                                <card.icon className="h-6 w-6" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-gray-700">Today's Schedule</h3>
                {todayAppts.length > 0 ? (
                    <div className="space-y-3">
                        {todayAppts.map((appt) => (
                            <div key={appt._id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                        {appt.patientId?.name?.[0] || '?'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{appt.patientId?.name}</p>
                                        <p className="text-xs text-gray-400">{appt.timeSlot} · {appt.reason || 'General'}</p>
                                    </div>
                                </div>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[appt.status]}`}>
                                    {appt.status}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-center text-sm text-gray-400">No appointments today 🎉</div>
                )}
            </div>
        </div>
    );
};

export default DoctorDashboard;
