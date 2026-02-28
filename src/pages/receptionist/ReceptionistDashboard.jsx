import { useEffect, useState } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { HiOutlineCalendar, HiOutlineClipboardList, HiOutlineUserAdd } from 'react-icons/hi';

const ReceptionistDashboard = () => {
    const [stats, setStats] = useState({ patients: 0, todayAppointments: 0 });
    const [todayAppts, setTodayAppts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const today = new Date().toISOString().split('T')[0];
                const [patientsRes, apptsRes] = await Promise.all([
                    API.get('/patients'),
                    API.get(`/appointments?date=${today}`),
                ]);
                setStats({ patients: patientsRes.data.data.length, todayAppointments: apptsRes.data.data.length });
                setTodayAppts(apptsRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <LoadingSpinner text="Loading dashboard..." />;

    const statusColors = { pending: 'bg-amber-100 text-amber-700', confirmed: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Receptionist Dashboard</h1>
                <p className="text-sm text-gray-500">Manage patients and appointments</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="animate-fade-in rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Total Patients</p>
                            <p className="mt-1 text-3xl font-bold text-gray-800">{stats.patients}</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                            <HiOutlineClipboardList className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="animate-fade-in rounded-2xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Today's Appointments</p>
                            <p className="mt-1 text-3xl font-bold text-gray-800">{stats.todayAppointments}</p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500 text-white">
                            <HiOutlineCalendar className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="animate-fade-in rounded-2xl bg-gradient-to-r from-primary to-primary-light p-5 text-white shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-white/70">Quick Actions</p>
                            <p className="mt-1 text-lg font-bold">Register & Book</p>
                        </div>
                        <HiOutlineUserAdd className="h-8 w-8 text-white/60" />
                    </div>
                </div>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-gray-700">Today's Schedule</h3>
                {todayAppts.length > 0 ? (
                    <div className="space-y-3">
                        {todayAppts.map((appt) => (
                            <div key={appt._id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-800">{appt.patientId?.name}</p>
                                    <p className="text-xs text-gray-400">Dr. {appt.doctorId?.name} · {appt.timeSlot}</p>
                                </div>
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[appt.status]}`}>{appt.status}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="py-8 text-center text-sm text-gray-400">No appointments today</p>
                )}
            </div>
        </div>
    );
};

export default ReceptionistDashboard;
