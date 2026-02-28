const LoadingSpinner = ({ size = 'md', text = '' }) => {
    const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };

    return (
        <div className="flex flex-col items-center justify-center py-12">
            <div className={`${sizes[size]} animate-spin rounded-full border-3 border-gray-200 border-t-primary`} />
            {text && <p className="mt-3 text-sm text-gray-500">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
