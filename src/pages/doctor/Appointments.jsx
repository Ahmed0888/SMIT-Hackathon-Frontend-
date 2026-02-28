import { useEffect, useState } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterDate, setFilterDate] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const fetchAppointments = async () => {
        try {
            const params = new URLSearchParams();
            if (filterDate) params.append('date', filterDate);
            if (filterStatus) params.append('status', filterStatus);
            const { data } = await API.get(`/appointments?${params}`);
            setAppointments(data.data);
        } catch (err) {
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAppointments(); }, [filterDate, filterStatus]);

    const updateStatus = async (id, status) => {
        try {
            await API.put(`/appointments/${id}`, { status });
            toast.success(`Appointment ${status}`);
            fetchAppointments();
        } catch (err) {
            toast.error('Failed to update');
        }
    };

    const statusColors = { pending: 'bg-amber-100 text-amber-700', confirmed: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700' };

    if (loading) return <LoadingSpinner text="Loading appointments..." />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>

            <div className="flex flex-wrap gap-3">
                <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="space-y-3">
                {appointments.map((appt) => (
                    <div key={appt._id} className="animate-fade-in rounded-2xl bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                    {appt.patientId?.name?.[0]}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-800">{appt.patientId?.name}</p>
                                    <p className="text-xs text-gray-400">{appt.patientId?.gender} · {appt.patientId?.age} years · {appt.patientId?.contact}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-700">{new Date(appt.date).toLocaleDateString()}</p>
                                <p className="text-xs text-gray-400">{appt.timeSlot}</p>
                                <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusColors[appt.status]}`}>
                                    {appt.status}
                                </span>
                            </div>
                        </div>
                        {appt.reason && <p className="mt-2 text-sm text-gray-500">Reason: {appt.reason}</p>}
                        {appt.status === 'pending' && (
                            <div className="mt-3 flex gap-2">
                                <button onClick={() => updateStatus(appt._id, 'confirmed')} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-dark">Confirm</button>
                                <button onClick={() => updateStatus(appt._id, 'cancelled')} className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-200">Cancel</button>
                            </div>
                        )}
                        {appt.status === 'confirmed' && (
                            <button onClick={() => updateStatus(appt._id, 'completed')} className="mt-3 rounded-lg bg-green-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-600">Mark Completed</button>
                        )}
                    </div>
                ))}
                {appointments.length === 0 && <div className="rounded-2xl bg-white py-12 text-center text-sm text-gray-400 shadow-sm">No appointments found</div>}
            </div>
        </div>
    );
};

export default Appointments;
