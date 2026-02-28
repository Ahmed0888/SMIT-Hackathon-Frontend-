import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlineSearch, HiOutlineEye } from 'react-icons/hi';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patientDetail, setPatientDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const { data } = await API.get(`/patients?search=${search}`);
                setPatients(data.data);
            } catch (err) {
                toast.error('Failed to load patients');
            } finally {
                setLoading(false);
            }
        };
        const debounce = setTimeout(fetchPatients, 300);
        return () => clearTimeout(debounce);
    }, [search]);

    const viewPatient = async (id) => {
        setDetailLoading(true);
        try {
            const { data } = await API.get(`/patients/${id}`);
            setPatientDetail(data.data);
            setSelectedPatient(id);
        } catch (err) {
            toast.error('Failed to load patient details');
        } finally {
            setDetailLoading(false);
        }
    };

    if (loading) return <LoadingSpinner text="Loading patients..." />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Patients</h1>

            <div className="relative max-w-md">
                <HiOutlineSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or contact..."
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {patients.map((p) => (
                    <div key={p._id} className="animate-fade-in rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => viewPatient(p._id)}>
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                {p.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="truncate font-medium text-gray-800">{p.name}</p>
                                <p className="text-xs text-gray-400">{p.gender} · {p.age}y · {p.contact}</p>
                            </div>
                            <HiOutlineEye className="h-5 w-5 text-gray-300" />
                        </div>
                        {p.bloodGroup && <span className="mt-2 inline-block rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">{p.bloodGroup}</span>}
                    </div>
                ))}
            </div>
            {patients.length === 0 && <div className="rounded-2xl bg-white py-12 text-center text-sm text-gray-400 shadow-sm">No patients found</div>}

            {/* Patient Detail Modal */}
            {selectedPatient && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedPatient(null)}>
                    <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        {detailLoading ? (
                            <LoadingSpinner text="Loading details..." />
                        ) : patientDetail ? (
                            <div className="space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                                        {patientDetail.patient.name[0]}
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-800">{patientDetail.patient.name}</h2>
                                        <p className="text-sm text-gray-500">{patientDetail.patient.gender} · {patientDetail.patient.age}y · {patientDetail.patient.contact}</p>
                                    </div>
                                </div>

                                {patientDetail.patient.medicalHistory && (
                                    <div className="rounded-xl bg-gray-50 p-4">
                                        <p className="text-xs font-semibold uppercase text-gray-400">Medical History</p>
                                        <p className="mt-1 text-sm text-gray-700">{patientDetail.patient.medicalHistory}</p>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700">Appointments ({patientDetail.appointments.length})</h3>
                                    <div className="mt-2 space-y-2">
                                        {patientDetail.appointments.slice(0, 5).map((a) => (
                                            <div key={a._id} className="flex justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
                                                <span>{new Date(a.date).toLocaleDateString()} · {a.timeSlot}</span>
                                                <span className="capitalize text-gray-500">{a.status}</span>
                                            </div>
                                        ))}
                                        {patientDetail.appointments.length === 0 && <p className="text-xs text-gray-400">No appointments</p>}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700">Prescriptions ({patientDetail.prescriptions.length})</h3>
                                    <div className="mt-2 space-y-2">
                                        {patientDetail.prescriptions.slice(0, 5).map((rx) => (
                                            <div key={rx._id} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{rx.diagnosis || 'Prescription'}</span>
                                                    <span className="text-xs text-gray-400">{new Date(rx.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-xs text-gray-500">{rx.medicines.map((m) => m.name).join(', ')}</p>
                                            </div>
                                        ))}
                                        {patientDetail.prescriptions.length === 0 && <p className="text-xs text-gray-400">No prescriptions</p>}
                                    </div>
                                </div>

                                <button onClick={() => setSelectedPatient(null)} className="w-full rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">Close</button>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Patients;
