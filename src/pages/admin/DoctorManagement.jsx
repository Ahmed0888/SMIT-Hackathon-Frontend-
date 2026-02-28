import { useEffect, useState } from 'react';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';

const DoctorManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'doctor', specialization: '', phone: '', plan: 'free' });
    const [submitting, setSubmitting] = useState(false);

    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/auth/users');
            setUsers(data.data);
        } catch (err) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const resetForm = () => {
        setForm({ name: '', email: '', password: '', role: 'doctor', specialization: '', phone: '', plan: 'free' });
        setEditingUser(null);
        setShowModal(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingUser) {
                await API.put(`/auth/users/${editingUser._id}`, form);
                toast.success('User updated');
            } else {
                await API.post('/auth/register', form);
                toast.success('User created');
            }
            resetForm();
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setForm({ name: user.name, email: user.email, password: '', role: user.role, specialization: user.specialization || '', phone: user.phone || '', plan: user.plan });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await API.delete(`/auth/users/${id}`);
            toast.success('User deleted');
            fetchUsers();
        } catch (err) {
            toast.error('Failed to delete user');
        }
    };

    if (loading) return <LoadingSpinner text="Loading users..." />;

    const roleBadge = (role) => {
        const colors = { admin: 'bg-purple-100 text-purple-700', doctor: 'bg-teal-100 text-teal-700', receptionist: 'bg-blue-100 text-blue-700', patient: 'bg-amber-100 text-amber-700' };
        return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${colors[role]}`}>{role}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                    <p className="text-sm text-gray-500">{users.length} users in system</p>
                </div>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors">
                    <HiOutlinePlus className="h-4 w-4" /> Add User
                </button>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-100 bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-500">Name</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Email</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Role</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Plan</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                                <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-800">{u.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                    <td className="px-6 py-4">{roleBadge(u.role)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-semibold uppercase ${u.plan === 'pro' ? 'text-primary' : 'text-gray-400'}`}>
                                            {u.plan}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex h-2 w-2 rounded-full ${u.isActive ? 'bg-success' : 'bg-gray-300'}`} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(u)} className="rounded-lg p-1.5 text-gray-400 hover:bg-primary/10 hover:text-primary"><HiOutlinePencil className="h-4 w-4" /></button>
                                            <button onClick={() => handleDelete(u._id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-danger"><HiOutlineTrash className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {users.length === 0 && <div className="py-12 text-center text-sm text-gray-400">No users found</div>}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => resetForm()}>
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-lg font-bold text-gray-800">{editingUser ? 'Edit User' : 'Add New User'}</h2>
                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">Full Name</label>
                                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">Email</label>
                                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required disabled={!!editingUser} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 disabled:bg-gray-100" />
                                </div>
                            </div>
                            {!editingUser && (
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">Password</label>
                                    <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                                </div>
                            )}
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">Role</label>
                                    <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none">
                                        <option value="doctor">Doctor</option>
                                        <option value="receptionist">Receptionist</option>
                                        <option value="patient">Patient</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">Plan</label>
                                    <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none">
                                        <option value="free">Free</option>
                                        <option value="pro">Pro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-medium text-gray-600">Phone</label>
                                    <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-600">Specialization</label>
                                <input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="e.g., Cardiologist" className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30" />
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={resetForm} className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={submitting} className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50">
                                    {submitting ? 'Saving...' : editingUser ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorManagement;
