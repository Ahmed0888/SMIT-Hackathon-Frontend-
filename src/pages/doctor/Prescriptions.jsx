import { useEffect, useState } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

const Prescriptions = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        patientId: '',
        diagnosis: '',
        instructions: '',
        medicines: [{ name: '', dosage: '', duration: '' }],
    });

    useEffect(() => {
        API.get('/patients').then(({ data }) => setPatients(data.data)).catch(() => { });
    }, []);

    const fetchPrescriptions = async (patientId) => {
        if (!patientId) return;
        setLoading(true);
        try {
            const { data } = await API.get(`/prescriptions/${patientId}`);
            setPrescriptions(data.data);
        } catch (err) {
            toast.error('Failed to load prescriptions');
        } finally {
            setLoading(false);
        }
    };

    const handlePatientChange = (pid) => {
        setSelectedPatientId(pid);
        setForm({ ...form, patientId: pid });
        fetchPrescriptions(pid);
    };

    const addMedicine = () => setForm({ ...form, medicines: [...form.medicines, { name: '', dosage: '', duration: '' }] });
    const removeMedicine = (index) => setForm({ ...form, medicines: form.medicines.filter((_, i) => i !== index) });
    const updateMedicine = (index, field, value) => {
        const meds = [...form.medicines];
        meds[index][field] = value;
        setForm({ ...form, medicines: meds });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.patientId || form.medicines.some((m) => !m.name || !m.dosage || !m.duration)) {
            toast.error('Please fill all required fields');
            return;
        }
        setSubmitting(true);
        try {
            await API.post('/prescriptions', form);
            toast.success('Prescription created!');
            setShowForm(false);
            setForm({ patientId: selectedPatientId, diagnosis: '', instructions: '', medicines: [{ name: '', dosage: '', duration: '' }] });
            fetchPrescriptions(selectedPatientId);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create prescription');
        } finally {
            setSubmitting(false);
        }
    };

    const downloadPDF = async (id) => {
        try {
            const response = await API.get(`/prescriptions/${id}/pdf`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `prescription-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('PDF downloaded!');
        } catch (err) {
            toast.error('Failed to download PDF');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
                    <HiOutlinePlus className="h-4 w-4" /> New Prescription
                </button>
            </div>

            <div className="max-w-xs">
                <select value={selectedPatientId} onChange={(e) => handlePatientChange(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none">
                    <option value="">Select Patient</option>
                    {patients.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.age}y)</option>)}
                </select>
            </div>

            {/* New Prescription Form */}
            {showForm && (
                <div className="animate-fade-in rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-sm font-semibold text-gray-700">New Prescription</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">Patient *</label>
                            <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} required className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none">
                                <option value="">Select Patient</option>
                                {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">Diagnosis</label>
                            <input value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                        </div>
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-xs font-medium text-gray-600">Medicines *</label>
                                <button type="button" onClick={addMedicine} className="text-xs font-medium text-primary hover:underline">+ Add Medicine</button>
                            </div>
                            {form.medicines.map((med, index) => (
                                <div key={index} className="mb-2 flex gap-2">
                                    <input value={med.name} onChange={(e) => updateMedicine(index, 'name', e.target.value)} placeholder="Medicine name" required className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                                    <input value={med.dosage} onChange={(e) => updateMedicine(index, 'dosage', e.target.value)} placeholder="Dosage" required className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                                    <input value={med.duration} onChange={(e) => updateMedicine(index, 'duration', e.target.value)} placeholder="Duration" required className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                                    {form.medicines.length > 1 && (
                                        <button type="button" onClick={() => removeMedicine(index)} className="rounded-lg p-2 text-gray-400 hover:text-danger"><HiOutlineTrash className="h-4 w-4" /></button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">Instructions</label>
                            <textarea value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none" />
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setShowForm(false)} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                            <button type="submit" disabled={submitting} className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50">
                                {submitting ? 'Creating...' : 'Create Prescription'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Prescriptions List */}
            {loading ? <LoadingSpinner /> : (
                <div className="space-y-3">
                    {prescriptions.map((rx) => (
                        <div key={rx._id} className="animate-fade-in rounded-2xl bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium text-gray-800">{rx.diagnosis || 'Prescription'}</p>
                                    <p className="text-xs text-gray-400">{new Date(rx.createdAt).toLocaleDateString()} · Dr. {rx.doctorId?.name}</p>
                                </div>
                                <button onClick={() => downloadPDF(rx._id)} className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20">
                                    📥 PDF
                                </button>
                            </div>
                            <div className="mt-3 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-xs text-gray-400">
                                            <th className="pb-1">Medicine</th>
                                            <th className="pb-1">Dosage</th>
                                            <th className="pb-1">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rx.medicines.map((m, i) => (
                                            <tr key={i} className="border-t border-gray-50">
                                                <td className="py-1.5 text-gray-700">{m.name}</td>
                                                <td className="py-1.5 text-gray-500">{m.dosage}</td>
                                                <td className="py-1.5 text-gray-500">{m.duration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {rx.instructions && <p className="mt-2 rounded-lg bg-gray-50 p-2 text-xs text-gray-600">{rx.instructions}</p>}
                        </div>
                    ))}
                    {selectedPatientId && prescriptions.length === 0 && !loading && (
                        <div className="rounded-2xl bg-white py-12 text-center text-sm text-gray-400 shadow-sm">No prescriptions for this patient</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Prescriptions;
