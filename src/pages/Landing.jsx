import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

export default function Landing() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleAccept = () => {
        setIsModalOpen(false);
        navigate('/register');
    };

    return (
        <div className="min-h-screen bg-clinical-gray flex flex-col">
            <header className="p-4 bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto font-bold text-2xl text-clinical-blue flex items-center gap-2">
                    <span>DentalSens-RWE</span>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                <div className="max-w-3xl mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                        Estudio Nacional de <br className="hidden md:block" />
                        <span className="text-clinical-blue">Hipersensibilidad Dentinal</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Una iniciativa para entender y mejorar la salud oral en Colombia.
                        Registra tu sensibilidad, descubre patrones y aprende a manejarla.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button onClick={() => setIsModalOpen(true)} className="text-lg px-8 py-3 w-full sm:w-auto shadow-lg shadow-clinical-blue/20">
                            Participar en el Estudio
                        </Button>
                        <Button variant="secondary" onClick={() => navigate('/login')} className="text-lg px-8 py-3 w-full sm:w-auto">
                            Ya tengo una cuenta
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl text-left">
                    <FeatureCard title="Monitoreo Continuo" description="Registra tus episodios de sensibilidad y visualiza tu progreso en el tiempo." icon="📊" />
                    <FeatureCard title="Análisis de Desencadenantes" description="Identifica qué causa tu dolor: frío, calor, dulces o cepillado." icon="❄️" />
                    <FeatureCard title="Educación Personalizada" description="Recibe consejos prácticos para mejorar tu calidad de vida." icon="🎓" />
                </div>
            </main>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Consentimiento Informado">
                <div className="space-y-4 text-left text-gray-700">
                    <p className="text-sm">
                        Antes de continuar, por favor lee detenidamente y acepta los términos de participación.
                    </p>
                    <div className="bg-gray-50 p-4 rounded-lg text-sm border border-gray-200 shadow-inner max-h-60 overflow-y-auto">
                        <h4 className="font-semibold mb-2 text-clinical-blue">Términos y Condiciones</h4>
                        <p className="mb-4">
                            La participación en el estudio "DentalSens-RWE" es voluntaria. Sus datos serán almacenados de forma segura y utilizados exclusivamente con fines epidemiológicos y estadísticos. No se compartirán datos personales identificables con terceros sin su autorización expresa.
                        </p>
                        <h4 className="font-semibold mb-2 text-clinical-blue">Consentimiento</h4>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>Confirmo que soy mayor de 18 años.</li>
                            <li>Resido actualmente en Colombia.</li>
                            <li>Acepto compartir información sobre mi salud oral para este estudio.</li>
                            <li>Entiendo que puedo retirarme en cualquier momento.</li>
                        </ul>
                    </div>
                    <div className="flex gap-3 justify-end pt-4 border-t mt-4">
                        <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button onClick={handleAccept}>Acepto y Continuar</Button>
                    </div>
                </div>
            </Modal>

            <footer className="p-6 text-center text-gray-400 text-sm bg-gray-50 border-t">
                <p>© 2026 DentalSens-RWE. Estudio Epidemiológico Colombia.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ title, description, icon }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-3">{icon}</div>
            <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    )
}
