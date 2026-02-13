export default function Button({ children, onClick, variant = 'primary', className = '', ...props }) {
    const baseStyles = "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    const variants = {
        primary: "bg-clinical-blue text-white hover:bg-clinical-blue-hover focus:ring-clinical-blue",
        secondary: "bg-white text-clinical-blue border border-clinical-blue hover:bg-clinical-light focus:ring-clinical-blue",
        ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300",
        danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    };

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
