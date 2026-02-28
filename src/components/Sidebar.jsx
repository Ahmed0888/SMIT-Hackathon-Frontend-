import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiOutlineHome,
    HiOutlineUsers,
    HiOutlineCalendar,
    HiOutlineClipboardList,
    HiOutlineChartBar,
    HiOutlineCog,
    HiOutlineBeaker,
    HiOutlineUserAdd,
    HiOutlineDocumentText,
} from 'react-icons/hi';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    const navItems = {
        admin: [
            { to: '/admin/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
            { to: '/admin/doctors', icon: HiOutlineUsers, label: 'Manage Doctors' },
            { to: '/admin/patients', icon: HiOutlineClipboardList, label: 'All Patients' },
            { to: '/admin/appointments', icon: HiOutlineCalendar, label: 'Appointments' },
            { to: '/admin/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
        ],
        doctor: [
            { to: '/doctor/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
            { to: '/doctor/appointments', icon: HiOutlineCalendar, label: 'My Appointments' },
            { to: '/doctor/patients', icon: HiOutlineClipboardList, label: 'Patients' },
            { to: '/doctor/prescriptions', icon: HiOutlineDocumentText, label: 'Prescriptions' },
            { to: '/doctor/ai-checker', icon: HiOutlineBeaker, label: 'AI Diagnosis' },
        ],
        receptionist: [
            { to: '/receptionist/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
            { to: '/receptionist/register-patient', icon: HiOutlineUserAdd, label: 'Register Patient' },
            { to: '/receptionist/book-appointment', icon: HiOutlineCalendar, label: 'Book Appointment' },
            { to: '/receptionist/patients', icon: HiOutlineClipboardList, label: 'Patients' },
        ],
        patient: [
            { to: '/patient/dashboard', icon: HiOutlineHome, label: 'Dashboard' },
            { to: '/patient/history', icon: HiOutlineDocumentText, label: 'Medical History' },
        ],
    };

    const items = navItems[user?.role] || [];

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={onClose} />
            )}

            <aside
                className={`fixed left-0 top-0 z-30 h-full w-64 bg-dark text-white shadow-xl transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Logo */}
                <div className="flex h-16 items-center gap-3 border-b border-white/10 px-6">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-lg font-bold">
                        M
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">MediFlow</h1>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400">Clinic SaaS</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-4 flex flex-col gap-1 px-3">
                    {items.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-primary/20 text-primary-light'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Plan Badge */}
                <div className="absolute bottom-4 left-3 right-3">
                    <div className={`rounded-lg px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${user?.plan === 'pro'
                            ? 'bg-gradient-to-r from-primary/30 to-secondary/30 text-primary-light'
                            : 'bg-white/5 text-gray-400'
                        }`}>
                        {user?.plan === 'pro' ? '⚡ Pro Plan' : '🔓 Free Plan'}
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
