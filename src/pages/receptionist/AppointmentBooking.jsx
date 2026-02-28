import { useEffect, useState } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';

const AppointmentBooking = () => {
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [form, setForm] = useState({ patientId: '', doctorId: '', date: '', timeSlot: '', reason: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsRes, doctorsRes] = await Promise.all([
                    API.get('/patients'),
                    API.get('/auth/users?role=doctor'),
                ]);
                setPatients(patientsRes.data.data);
                setDoctors(doctorsRes.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const timeSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.patientId || !form.doctorId || !form.date || !form.timeSlot) {
            toast.error('Please fill all required fields');
            return;
        }
        setSubmitting(true);
        try {
            await API.post('/appointments', form);
            toast.success('Appointment booked successfully!');
            setForm({ patientId: '', doctorId: '', date: '', timeSlot: '', reason: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Book Appointment</h1>
                <p className="text-sm text-gray-500">Schedule a patient visit</p>
            </div>

            <div className="animate-fade-in rounded-2xl bg-white p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Patient *</label>
                        <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} required className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-primary focus:bg-white focus:outline-none">
                            <option value="">Select Patient</option>
                            {patients.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.age}y, {p.gender})</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Doctor *</label>
                        <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })} required className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-primary focus:bg-white focus:outline-none">
                            <option value="">Select Doctor</option>
                            {doctors.map((d) => <option key={d._id} value={d._id}>Dr. {d.name} — {d.specialization || 'General'}</option>)}
                        </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Date *</label>
                            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required min={new Date().toISOString().split('T')[0]} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-primary focus:bg-white focus:outline-none" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Time Slot *</label>
                            <select value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} required className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-primary focus:bg-white focus:outline-none">
                                <option value="">Select Time</option>
                                {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Reason for Visit</label>
                        <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={2} placeholder="Brief description of the visit reason..." className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                    </div>

                    <button type="submit" disabled={submitting} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl disabled:opacity-50">
                        {submitting ? 'Booking...' : 'Book Appointment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AppointmentBooking;
