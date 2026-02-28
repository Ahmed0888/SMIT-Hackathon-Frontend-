import { useEffect, useState } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlineBeaker, HiOutlineLightningBolt } from 'react-icons/hi';

const AIChecker = () => {
    const { user, isPro } = useAuth();
    const [form, setForm] = useState({ symptoms: '', age: '', gender: 'male', patientId: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState([]);
    const [logs, setLogs] = useState([]);
    const [logsLoading, setLogsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsRes, logsRes] = await Promise.all([
                    API.get('/patients'),
                    API.get('/ai/diagnosis-logs'),
                ]);
                setPatients(patientsRes.data.data);
                setLogs(logsRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLogsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.symptoms || !form.age || !form.gender) {
            toast.error('Please fill all required fields');
            return;
        }
        setLoading(true);
        setResult(null);
        try {
            const { data } = await API.post('/ai/symptom-check', {
                symptoms: form.symptoms,
                age: parseInt(form.age),
                gender: form.gender,
                patientId: form.patientId || null,
            });
            setResult(data.data);
            toast.success('Analysis complete!');
            // Refresh logs
            const logsRes = await API.get('/ai/diagnosis-logs');
            setLogs(logsRes.data.data);
        } catch (err) {
            toast.error(err.response?.data?.message || 'AI analysis failed');
        } finally {
            setLoading(false);
        }
    };

    const riskColors = { Low: 'bg-green-100 text-green-700', Medium: 'bg-amber-100 text-amber-700', High: 'bg-red-100 text-red-700', Unknown: 'bg-gray-100 text-gray-500' };

    if (!isPro) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="max-w-md text-center animate-fade-in">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-3xl">🔒</div>
                    <h2 className="text-xl font-bold text-gray-800">Pro Feature</h2>
                    <p className="mt-2 text-sm text-gray-500">AI Diagnosis is available on the Pro plan. Contact your admin to upgrade.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">AI Symptom Checker</h1>
                <p className="text-sm text-gray-500">Powered by Gemini AI — for clinical decision support</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Input Form */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-700">
                        <HiOutlineBeaker className="h-5 w-5 text-primary" /> Symptom Analysis
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">Patient (optional)</label>
                            <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none">
                                <option value="">— No patient selected —</option>
                                {patients.map((p) => (
                                    <option key={p._id} value={p._id}>{p.name} ({p.age}y, {p.gender})</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Age *</label>
                                <input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required min="0" max="150" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none" />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Gender *</label>
                                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none">
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-600">Symptoms *</label>
                            <textarea value={form.symptoms} onChange={(e) => setForm({ ...form, symptoms: e.target.value })} required rows={4} placeholder="Describe the symptoms in detail... e.g., fever, headache, body ache for 3 days" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none" />
                        </div>
                        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:shadow-xl disabled:opacity-50 transition-all">
                            {loading ? (
                                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Analyzing...</>
                            ) : (
                                <><HiOutlineLightningBolt className="h-4 w-4" /> Run AI Analysis</>
                            )}
                        </button>
                    </form>
                </div>

                {/* Result */}
                <div className="space-y-4">
                    {result ? (
                        <div className="animate-fade-in rounded-2xl bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-sm font-semibold text-gray-700">Analysis Result</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-400">Risk Level</p>
                                    <span className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-bold ${riskColors[result.riskLevel]}`}>
                                        {result.riskLevel}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-400">Possible Conditions</p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {result.possibleConditions?.length > 0 ? result.possibleConditions.map((c, i) => (
                                            <span key={i} className="rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">{c}</span>
                                        )) : <p className="text-sm text-gray-400">No conditions identified</p>}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-400">Suggested Tests</p>
                                    <div className="mt-2 space-y-1">
                                        {result.suggestedTests?.length > 0 ? result.suggestedTests.map((t, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                                <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {t}
                                            </div>
                                        )) : <p className="text-sm text-gray-400">No tests suggested</p>}
                                    </div>
                                </div>
                                {result.message && <p className="rounded-lg bg-amber-50 p-3 text-xs text-amber-600">{result.message}</p>}
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center rounded-2xl bg-white p-6 shadow-sm">
                            <div className="text-center text-gray-400">
                                <HiOutlineBeaker className="mx-auto mb-2 h-12 w-12" />
                                <p className="text-sm">Enter symptoms and run analysis</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Logs */}
            <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-gray-700">Recent Diagnosis Logs</h3>
                {logsLoading ? <LoadingSpinner /> : logs.length > 0 ? (
                    <div className="space-y-2">
                        {logs.slice(0, 10).map((log) => (
                            <div key={log._id} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm">
                                <div className="flex-1 min-w-0">
                                    <p className="truncate font-medium text-gray-700">{log.symptoms}</p>
                                    <p className="text-xs text-gray-400">{log.patientId?.name || 'No patient'} · {new Date(log.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`ml-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskColors[log.riskLevel]}`}>{log.riskLevel}</span>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-sm text-gray-400">No diagnosis logs yet</p>}
            </div>
        </div>
    );
};

export default AIChecker;
