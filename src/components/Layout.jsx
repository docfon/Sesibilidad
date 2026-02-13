import { Outlet, useLocation, Link } from 'react-router-dom';
import { Activity, BookOpen, User, Menu, X, LogOut, Phone } from 'lucide-react';

export default function Layout() {
    const location = useLocation();

    // Helper to check active path
    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const navItems = [
        { path: '/dashboard', icon: Activity, label: 'Mi Sensibilidad' },
        { path: '/dashboard/learn', icon: BookOpen, label: 'Aprendizaje' },
        { path: '/dashboard/contact', icon: Phone, label: 'Experto' },
        { path: '/dashboard/profile', icon: User, label: 'Usuario' },
    ];

    return (
        <div className="min-h-screen bg-clinical-gray flex flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <nav className="hidden md:flex flex-col w-64 bg-white border-r shadow-sm fixed h-full z-20">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-clinical-blue">DentalSens-RWE</h1>
                </div>
                <div className="px-4 space-y-2">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(item.path)
                                ? 'bg-clinical-blue text-white shadow-md shadow-clinical-blue/20'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 overflow-y-auto min-h-screen pb-24 md:pb-8">
                <div className="max-w-5xl mx-auto p-4 md:p-8 animate-in fade-in duration-300">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-2 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
                {navItems.map(item => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg w-full transition-colors ${isActive(item.path)
                            ? 'text-clinical-blue'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <item.icon size={24} className={isActive(item.path) ? 'scale-110 transition-transform' : ''} />
                        <span className="text-[10px] font-medium mt-1">{item.label}</span>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
