import { useEffect, useState } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const MedicalHistory = () => {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState('');
    const [timeline, setTimeline] = useState(null);
    const [loading, setLoading] = useState(false);
    const [patientsLoading, setPatientsLoading] = useState(true);

    useEffect(() => {
        API.get('/patients')
            .then(({ data }) => setPatients(data.data))
            .catch(() => toast.error('Failed to load patients'))
            .finally(() => setPatientsLoading(false));
    }, []);

    const loadTimeline = async (id) => {
        setSelectedPatient(id);
        if (!id) return;
        setLoading(true);
        try {
            const { data } = await API.get(`/patients/${id}`);
            setTimeline(data.data);
        } catch (err) {
            toast.error('Failed to load history');
        } finally {
            setLoading(false);
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
            toast.success('PDF downloaded');
        } catch (err) {
            toast.error('Failed to download');
        }
    };

    if (patientsLoading) return <LoadingSpinner text="Loading..." />;

    const riskColors = { Low: 'border-green-400 bg-green-50', Medium: 'border-amber-400 bg-amber-50', High: 'border-red-400 bg-red-50', Unknown: 'border-gray-300 bg-gray-50' };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Medical History</h1>
                <p className="text-sm text-gray-500">Patient timeline & records</p>
            </div>

            <div className="max-w-sm">
                <select value={selectedPatient} onChange={(e) => loadTimeline(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-primary focus:outline-none">
                    <option value="">Select Patient</option>
                    {patients.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.age}y, {p.gender})</option>)}
                </select>
            </div>

            {loading && <LoadingSpinner />}

            {timeline && !loading && (
                <div className="space-y-6 animate-fade-in">
                    {/* Patient Card */}
                    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                            {timeline.patient.name[0]}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">{timeline.patient.name}</h2>
                            <p className="text-sm text-gray-500">{timeline.patient.gender} · {timeline.patient.age}y · {timeline.patient.contact}</p>
                            {timeline.patient.bloodGroup && <span className="text-xs text-red-500 font-medium">{timeline.patient.bloodGroup}</span>}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative ml-4 border-l-2 border-gray-200 pl-8 space-y-6">
                        {/* Appointments */}
                        {timeline.appointments.map((a) => (
                            <div key={a._id} className="relative">
                                <span className="absolute -left-10 top-1 h-4 w-4 rounded-full border-2 border-primary bg-white" />
                                <div className="rounded-xl bg-white p-4 shadow-sm">
                                    <p className="text-xs font-semibold uppercase text-primary">Appointment</p>
                                    <p className="text-sm text-gray-700">{new Date(a.date).toLocaleDateString()} · {a.timeSlot}</p>
                                    <p className="text-xs text-gray-400">Dr. {a.doctorId?.name} · <span className="capitalize">{a.status}</span></p>
                                </div>
                            </div>
                        ))}

                        {/* Prescriptions */}
                        {timeline.prescriptions.map((rx) => (
                            <div key={rx._id} className="relative">
                                <span className="absolute -left-10 top-1 h-4 w-4 rounded-full border-2 border-amber-500 bg-white" />
                                <div className="rounded-xl bg-white p-4 shadow-sm">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-xs font-semibold uppercase text-amber-600">Prescription</p>
                                            <p className="text-sm font-medium text-gray-700">{rx.diagnosis || 'Prescription'}</p>
                                            <p className="text-xs text-gray-400">{new Date(rx.createdAt).toLocaleDateString()} · Dr. {rx.doctorId?.name}</p>
                                        </div>
                                        <button onClick={() => downloadPDF(rx._id)} className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20">📥 PDF</button>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        {rx.medicines.map((m) => m.name).join(', ')}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Diagnosis Logs */}
                        {timeline.diagnosisLogs.map((log) => (
                            <div key={log._id} className="relative">
                                <span className="absolute -left-10 top-1 h-4 w-4 rounded-full border-2 border-purple-500 bg-white" />
                                <div className={`rounded-xl border-l-4 p-4 shadow-sm ${riskColors[log.riskLevel]}`}>
                                    <p className="text-xs font-semibold uppercase text-purple-600">AI Diagnosis</p>
                                    <p className="text-sm text-gray-700">{log.symptoms}</p>
                                    <p className="text-xs text-gray-400">{new Date(log.createdAt).toLocaleDateString()} · Risk: <span className="font-semibold">{log.riskLevel}</span></p>
                                </div>
                            </div>
                        ))}

                        {timeline.appointments.length === 0 && timeline.prescriptions.length === 0 && timeline.diagnosisLogs.length === 0 && (
                            <p className="text-sm text-gray-400">No records found for this patient</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicalHistory;
