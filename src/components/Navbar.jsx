import { useAuth } from '../context/AuthContext';
import { HiOutlineMenuAlt2, HiOutlineLogout, HiOutlineBell } from 'react-icons/hi';

const roleBadgeColors = {
    admin: 'bg-purple-100 text-purple-700',
    doctor: 'bg-teal-100 text-teal-700',
    receptionist: 'bg-blue-100 text-blue-700',
    patient: 'bg-amber-100 text-amber-700',
};

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
                >
                    <HiOutlineMenuAlt2 className="h-5 w-5" />
                </button>
                <div>
                    <h2 className="text-sm font-semibold text-gray-800">
                        Welcome back, <span className="text-primary">{user?.name}</span>
                    </h2>
                    <p className="text-xs text-gray-400">
                        {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Role Badge */}
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleBadgeColors[user?.role] || ''}`}>
                    {user?.role}
                </span>

                {/* Notifications placeholder */}
                <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <HiOutlineBell className="h-5 w-5" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
                </button>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-danger transition-colors"
                >
                    <HiOutlineLogout className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;
