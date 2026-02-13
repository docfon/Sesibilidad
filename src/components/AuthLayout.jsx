export default function AuthLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen bg-clinical-gray flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 animate-in fade-in zoom-in-95 duration-300">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                    {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
                </div>
                {children}
            </div>
        </div>
    );
}
