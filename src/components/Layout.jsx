import { Outlet, useLocation, Link } from 'react-router-dom';
import { Activity, BookOpen, User, Menu, X, LogOut, Phone, Users, Stethoscope, BarChart3, FlaskConical } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const location = useLocation();
    const { userProfile } = useAuth();
    const role = userProfile?.role || 'patient';

    // Helper to check active path
    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    // Role-based navigation items
    const patientNavItems = [
        { path: '/dashboard', icon: Activity, label: 'Mi Sensibilidad' },
        { path: '/dashboard/learn', icon: BookOpen, label: 'Aprendizaje' },
        { path: '/dashboard/contact', icon: Phone, label: 'Experto' },
        { path: '/dashboard/profile', icon: User, label: 'Usuario' },
    ];

    const dentistNavItems = [
        { path: '/dashboard', icon: Users, label: 'Pacientes' },
        { path: '/dashboard/profile', icon: User, label: 'Usuario' },
    ];

    const researcherNavItems = [
        { path: '/dashboard', icon: BarChart3, label: 'Datos' },
        { path: '/dashboard/profile', icon: User, label: 'Usuario' },
    ];

    const navItemsMap = { dentist: dentistNavItems, researcher: researcherNavItems };
    const navItems = navItemsMap[role] || patientNavItems;

    // Title and subtitle based on role
    const roleConfig = {
        dentist: { title: 'DentalSens - Odontólogo', subtitle: 'Portal Profesional', icon: Stethoscope },
        researcher: { title: 'DentalSens - Investigador', subtitle: 'Portal de Investigación', icon: FlaskConical },
    };
    const appTitle = roleConfig[role]?.title || 'DentalSens-RWE';
    const roleInfo = roleConfig[role];

    return (
        <div className="min-h-screen bg-clinical-gray flex flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <nav className="hidden md:flex flex-col w-64 bg-white border-r shadow-sm fixed h-full z-20">
                <div className="p-6">
                    <h1 className="text-xl font-bold text-clinical-blue">{appTitle}</h1>
                    {roleInfo && (
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <roleInfo.icon size={12} /> {roleInfo.subtitle}
                        </p>
                    )}
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
