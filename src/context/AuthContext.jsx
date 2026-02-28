import { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = localStorage.getItem('mediflow_token');
        const savedUser = localStorage.getItem('mediflow_user');
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await API.post('/auth/login', { email, password });
        const { token: newToken, ...userData } = data.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('mediflow_token', newToken);
        localStorage.setItem('mediflow_user', JSON.stringify(userData));
        return userData;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('mediflow_token');
        localStorage.removeItem('mediflow_user');
    };

    const value = {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin',
        isDoctor: user?.role === 'doctor',
        isReceptionist: user?.role === 'receptionist',
        isPatient: user?.role === 'patient',
        isPro: user?.plan === 'pro',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
