import Button from '../../components/ui/Button';
import { MessageCircle, Phone } from 'lucide-react';

export default function ContactModule() {
    const phoneNumber = "573174271758";
    const message = "Hola, soy participante del estudio DentalSens-RWE y tengo una duda.";

    const handleWhatsAppClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Contacta a un Experto</h2>
                <p className="text-gray-500 text-sm">Resuelve tus dudas con nuestro personal de salud</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-8 text-center max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle size={32} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">¿Tienes preguntas sobre el estudio o tu sensibilidad?</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Nuestro equipo de expertos en sensibilidad dental está disponible para ayudarte.
                    Si tienes inquietudes sobre el uso de la aplicación, tus registros o síntomas,
                    no dudes en contactarnos directamente a través de WhatsApp.
                </p>

                <Button
                    onClick={handleWhatsAppClick}
                    className="bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3 text-lg shadow-lg shadow-green-500/20 flex items-center justify-center gap-3 mx-auto transition-transform active:scale-95"
                >
                    <Phone size={20} />
                    Chat con Experto
                </Button>

                <p className="text-xs text-gray-400 mt-6">
                    Horario de atención: Lunes a Viernes de 8:00 AM a 5:00 PM
                </p>
            </div>
        </div>
    );
}
