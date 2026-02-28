import { useEffect, useState } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiOutlineUsers, HiOutlineClipboardList, HiOutlineCalendar, HiOutlineDocumentText, HiOutlineBeaker } from 'react-icons/hi';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await API.get('/analytics/admin');
                setStats(data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <LoadingSpinner text="Loading dashboard..." />;

    const cards = [
        { label: 'Total Patients', value: stats?.counts?.totalPatients || 0, icon: HiOutlineClipboardList, color: 'bg-teal-500' },
        { label: 'Doctors', value: stats?.counts?.doctors || 0, icon: HiOutlineUsers, color: 'bg-indigo-500' },
        { label: 'Appointments', value: stats?.counts?.totalAppointments || 0, icon: HiOutlineCalendar, color: 'bg-amber-500' },
        { label: 'Prescriptions', value: stats?.counts?.totalPrescriptions || 0, icon: HiOutlineDocumentText, color: 'bg-rose-500' },
        { label: 'AI Diagnoses', value: stats?.counts?.totalDiagnosis || 0, icon: HiOutlineBeaker, color: 'bg-purple-500' },
        { label: 'Receptionists', value: stats?.counts?.receptionists || 0, icon: HiOutlineUsers, color: 'bg-sky-500' },
    ];

    const monthlyData = {
        labels: stats?.monthlyAppointments?.map((m) => m._id) || [],
        datasets: [{
            label: 'Appointments',
            data: stats?.monthlyAppointments?.map((m) => m.count) || [],
            backgroundColor: 'rgba(15, 118, 110, 0.7)',
            borderRadius: 8,
        }],
    };

    const statusData = {
        labels: stats?.appointmentsByStatus?.map((s) => s._id) || [],
        datasets: [{
            data: stats?.appointmentsByStatus?.map((s) => s.count) || [],
            backgroundColor: ['#f59e0b', '#22c55e', '#6366f1', '#ef4444'],
        }],
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Complete overview of your clinic</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold text-gray-700">Monthly Appointments</h3>
                    {monthlyData.labels.length > 0 ? (
                        <Bar data={monthlyData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    ) : (
                        <div className="flex h-48 items-center justify-center text-sm text-gray-400">No data yet</div>
                    )}
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold text-gray-700">Appointment Status</h3>
                    {statusData.labels.length > 0 ? (
                        <div className="mx-auto max-w-[240px]">
                            <Doughnut data={statusData} options={{ responsive: true }} />
                        </div>
                    ) : (
                        <div className="flex h-48 items-center justify-center text-sm text-gray-400">No data yet</div>
                    )}
                </div>
            </div>

            {/* Recent Patients */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-gray-700">Recent Patients</h3>
                {stats?.recentPatients?.length > 0 ? (
                    <div className="space-y-3">
                        {stats.recentPatients.map((p) => (
                            <div key={p._id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                        {p.name?.[0]}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{p.name}</p>
                                        <p className="text-xs text-gray-400">{p.gender} · {p.age} years</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {new Date(p.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No patients registered yet</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
