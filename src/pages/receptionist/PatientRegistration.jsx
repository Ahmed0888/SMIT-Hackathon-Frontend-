import { useState } from 'react';
import API from '../../services/api';
import toast from 'react-hot-toast';

const PatientRegistration = () => {
    const [form, setForm] = useState({ name: '', age: '', gender: 'male', contact: '', address: '', bloodGroup: '', medicalHistory: '' });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await API.post('/patients', { ...form, age: parseInt(form.age) });
            toast.success('Patient registered successfully!');
            setForm({ name: '', age: '', gender: 'male', contact: '', address: '', bloodGroup: '', medicalHistory: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Register Patient</h1>
                <p className="text-sm text-gray-500">Add a new patient to the system</p>
            </div>

            <div className="animate-fade-in rounded-2xl bg-white p-6 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name *</label>
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Age *</label>
                            <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required min="0" max="150" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Gender *</label>
                            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-primary focus:bg-white focus:outline-none">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Contact *</label>
                            <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} required placeholder="03xx-xxxxxxx" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-gray-700">Blood Group</label>
                            <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-primary focus:bg-white focus:outline-none">
                                <option value="">Select</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => <option key={bg} value={bg}>{bg}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Address</label>
                        <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Medical History</label>
                        <textarea value={form.medicalHistory} onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })} rows={3} placeholder="Allergies, chronic conditions, past surgeries..." className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm transition-colors focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                    </div>

                    <button type="submit" disabled={submitting} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-xl disabled:opacity-50">
                        {submitting ? 'Registering...' : 'Register Patient'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PatientRegistration;
