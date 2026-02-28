import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-bg p-6">
            <div className="max-w-md text-center animate-fade-in">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-danger/10 text-4xl">
                    🚫
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Access Denied</h1>
                <p className="mt-2 text-gray-500">
                    You don't have permission to access this page. Please contact your administrator.
                </p>
                <Link
                    to="/login"
                    className="mt-6 inline-block rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
                >
                    Back to Login
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
