import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { ChevronDown, ChevronUp, BookOpen, Coffee, Sparkles, ShieldAlert, CheckCircle, Circle } from 'lucide-react';
import Button from '../../components/ui/Button';

const TOPICS = [
    {
        id: '1',
        title: 'Técnicas de Cepillado',
        icon: Sparkles,
        content: 'Usa un cepillo de cerdas suaves y evita movimientos horizontales fuertes. Cepilla en círculos suaves o con un ángulo de 45 grados hacia la encía. La fuerza excesiva desgasta el esmalte y expone la dentina.'
    },
    {
        id: '2',
        title: 'Alimentos a Evitar',
        icon: Coffee,
        content: 'Reduce el consumo de alimentos ácidos como cítricos, sodas y vinos, ya que erosionan el esmalte. Si los consumes, espera al menos 30 minutos antes de cepillarte para permitir que la saliva neutralice el ácido.'
    },
    {
        id: '3',
        title: 'Cremas Desensibilizantes',
        icon: ShieldAlert,
        content: 'Estas cremas contienen compuestos como nitrato de potasio que bloquean la transmisión del dolor al nervio, o estroncio que sella los túbulos. Para mejores resultados, úsalas diariamente dos veces al día. También puedes aplicar una pequeña cantidad directamente sobre el diente sensible con el dedo antes de dormir.'
    },
    {
        id: '4',
        title: 'Mitos Comunes',
        icon: BookOpen,
        content: 'Mito: "El dolor pasará solo". Realidad: La sensibilidad suele empeorar si no se trata la causa subyacente (recesión de encías, desgaste, caries). Es importante consultar a tu odontólogo para un diagnóstico preciso.'
    }
];

export default function LearningModule() {
    const { user } = useAuth();
    const [expandedId, setExpandedId] = useState(null);
    const [readArticles, setReadArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchProgress();
    }, [user]);

    const fetchProgress = async () => {
        try {
            const { data, error } = await supabase
                .from('learning_progress')
                .select('article_id')
                .eq('user_id', user.id);

            if (error) throw error;
            setReadArticles(data.map(item => item.article_id));
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleReadStatus = async (e, articleId) => {
        e.stopPropagation(); // Prevent toggling accordion
        const isRead = readArticles.includes(articleId);

        try {
            if (isRead) {
                // Remove from read
                const { error } = await supabase
                    .from('learning_progress')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('article_id', articleId);
                if (error) throw error;
                setReadArticles(prev => prev.filter(id => id !== articleId));
            } else {
                // Mark as read
                const { error } = await supabase
                    .from('learning_progress')
                    .insert({ user_id: user.id, article_id: articleId });
                if (error) throw error;
                setReadArticles(prev => [...prev, articleId]);
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar el estado de lectura');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Centro de Aprendizaje</h2>
                    <p className="text-gray-500 text-sm">Consejos expertos para manejar tu sensibilidad</p>
                </div>
                <div className="text-right hidden sm:block">
                    <div className="text-2xl font-bold text-clinical-blue">{readArticles.length}/{TOPICS.length}</div>
                    <div className="text-xs text-gray-400 uppercase font-semibold">Leídos</div>
                </div>
            </div>

            {/* Mobile progress bar */}
            <div className="sm:hidden w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-clinical-blue h-2.5 rounded-full transition-all duration-500" style={{ width: `${(readArticles.length / TOPICS.length) * 100}%` }}></div>
            </div>

            <div className="grid gap-4">
                {TOPICS.map(topic => {
                    const isRead = readArticles.includes(topic.id);
                    return (
                        <div
                            key={topic.id}
                            className={`bg-white rounded-xl shadow-sm border transition-all duration-200 cursor-pointer overflow-hidden ${isRead ? 'border-green-100 bg-green-50/30' : 'border-gray-100 hover:shadow-md'}`}
                            onClick={() => setExpandedId(expandedId === topic.id ? null : topic.id)}
                        >
                            <div className="w-full flex items-center justify-between p-5 text-left">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className={`p-3 rounded-full transition-colors shrink-0 ${isRead ? 'bg-green-100 text-green-600' : (expandedId === topic.id ? 'bg-clinical-blue text-white' : 'bg-blue-50 text-clinical-blue')}`}>
                                        <topic.icon size={24} />
                                    </div>
                                    <span className={`font-semibold text-lg flex-1 ${isRead ? 'text-gray-600' : (expandedId === topic.id ? 'text-clinical-blue' : 'text-gray-900')}`}>
                                        {topic.title}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={(e) => toggleReadStatus(e, topic.id)}
                                        className={`p-2 rounded-full transition-colors ${isRead ? 'text-green-500 hover:bg-green-100' : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500'}`}
                                        title={isRead ? "Marcar como no leído" : "Marcar como leído"}
                                    >
                                        {isRead ? <CheckCircle size={24} /> : <Circle size={24} />}
                                    </button>
                                    {expandedId === topic.id ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                </div>
                            </div>

                            {expandedId === topic.id && (
                                <div className="px-5 pb-6 pl-[4.5rem] pr-16 animate-in slide-in-from-top-1 duration-200">
                                    <p className="text-gray-600 leading-relaxed mb-4">
                                        {topic.content}
                                    </p>
                                    {!isRead && (
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={(e) => toggleReadStatus(e, topic.id)}
                                            className="text-xs"
                                        >
                                            Marcar como leído
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
