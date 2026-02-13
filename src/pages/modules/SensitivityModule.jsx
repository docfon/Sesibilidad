import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Plus, Thermometer, Wind, Candy, Brush, Activity } from 'lucide-react';

const TRIGGERS_LIST = [
    { id: 'Frío', label: 'Frío', icon: Wind },
    { id: 'Calor', label: 'Calor', icon: Thermometer },
    { id: 'Dulce', label: 'Dulce', icon: Candy },
    { id: 'Cepillado', label: 'Cepillado', icon: Brush },
];

export default function SensitivityModule() {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Form State
    const [vasScore, setVasScore] = useState(null); // Changed to null to force selection
    const [selectedTriggers, setSelectedTriggers] = useState([]);
    const [qolImpact, setQolImpact] = useState(null); // Changed default
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user) fetchLogs();
    }, [user]);

    const fetchLogs = async () => {
        try {
            const { data, error } = await supabase
                .from('sensitivity_logs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true });

            if (error) throw error;
            setLogs(data || []);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTriggerToggle = (trigger) => {
        setSelectedTriggers(prev =>
            prev.includes(trigger)
                ? prev.filter(t => t !== trigger)
                : [...prev, trigger]
        );
    };

    const handleSubmit = async () => {
        // Validation Logic
        if (vasScore === null) {
            alert('Por favor selecciona un nivel de intensidad de dolor.');
            return;
        }

        if (vasScore > 1) {
            if (selectedTriggers.length === 0) {
                alert('Si tuviste dolor, por favor selecciona al menos un desencadenante.');
                return;
            }
            if (!qolImpact) {
                alert('Por favor indica el impacto en tu calidad de vida.');
                return;
            }
        }

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('sensitivity_logs')
                .insert({
                    user_id: user.id,
                    vas_score: vasScore,
                    triggers: selectedTriggers,
                    qol_impact: qolImpact || 'Nada', // Default if score <= 1
                    created_at: new Date().toISOString()
                });

            if (error) throw error;

            setIsModalOpen(false);
            // Reset form
            setVasScore(null);
            setSelectedTriggers([]);
            setQolImpact(null);
            fetchLogs();
        } catch (error) {
            console.error('Error saving log:', error);
            alert('Error al guardar el registro');
        } finally {
            setSubmitting(false);
        }
    };

    // Format data for chart
    const chartData = logs.map(log => ({
        date: new Date(log.created_at).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' }),
        score: log.vas_score
    }));

    // Get color for VAS score
    const getVasColor = (score) => {
        if (score === null) return 'text-gray-300';
        if (score <= 3) return 'text-green-500';
        if (score <= 6) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Mi Sensibilidad</h2>
                    <p className="text-gray-500 text-sm">Registra y monitorea tus episodios</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 shadow-lg shadow-clinical-blue/20">
                    <Plus size={20} />
                    <span className="hidden sm:inline">Nuevo Registro</span>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <div className="text-gray-500 text-xs uppercase mb-1">Registros</div>
                    <div className="text-2xl font-bold text-clinical-blue">{logs.length}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <div className="text-gray-500 text-xs uppercase mb-1">Promedio VAS</div>
                    <div className="text-2xl font-bold text-gray-800">
                        {logs.length > 0
                            ? (logs.reduce((a, b) => a + b.vas_score, 0) / logs.length).toFixed(1)
                            : '-'}
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <div className="text-gray-500 text-xs uppercase mb-1">Último</div>
                    <div className={`text-2xl font-bold ${logs.length > 0 ? getVasColor(logs[logs.length - 1].vas_score) : 'text-gray-800'}`}>
                        {logs.length > 0 ? logs[logs.length - 1].vas_score : '-'}
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border h-96">
                <h3 className="text-lg font-semibold mb-6 text-gray-700">Historial de Dolor (Intensidad 0-10)</h3>
                {logs.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                                dy={10}
                            />
                            <YAxis
                                domain={[0, 10]}
                                tickCount={6}
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#0077b6"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#0077b6', strokeWidth: 0 }}
                                activeDot={{ r: 6, stroke: '#caf0f8', strokeWidth: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <Activity size={48} className="mb-2 opacity-20" />
                        <p>No hay datos registrados aún.</p>
                        <p className="text-sm">Comienza agregando tu primer registro.</p>
                    </div>
                )}
            </div>

            {/* New Entry Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Registro de Sensibilidad">
                <div className="space-y-8 py-2">
                    {/* VAS Slider */}
                    <div>
                        <div className="flex justify-between items-end mb-4">
                            <label className="text-sm font-medium text-gray-700">
                                Intensidad del Dolor
                            </label>
                            <span className={`text-3xl font-bold ${getVasColor(vasScore)}`}>
                                {vasScore !== null ? vasScore : '-'}
                            </span>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="10"
                            step="1"
                            value={vasScore !== null ? vasScore : 5} // Default visual pos
                            onChange={(e) => setVasScore(parseInt(e.target.value))}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-clinical-blue focus:outline-none focus:ring-2 focus:ring-clinical-light"
                        />
                        {vasScore === null && <p className="text-xs text-red-500 mt-1">Desliza para seleccionar un valor</p>}

                        <div className="flex justify-between text-xs font-medium text-gray-400 mt-2">
                            <span>Sin dolor (0)</span>
                            <span>Severo (10)</span>
                        </div>
                    </div>

                    {/* Triggers - Conditionally disabled/visual cues could be added, but validation logic handles strictness */}
                    <div className={vasScore !== null && vasScore <= 1 ? "opacity-50 pointer-events-none" : ""}>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            ¿Qué lo desencadenó? {vasScore > 1 && <span className="text-red-500">*</span>}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {TRIGGERS_LIST.map(trigger => (
                                <button
                                    key={trigger.id}
                                    onClick={() => handleTriggerToggle(trigger.id)}
                                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-200 ${selectedTriggers.includes(trigger.id)
                                        ? 'bg-clinical-blue/10 border-clinical-blue text-clinical-blue font-medium'
                                        : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                >
                                    <trigger.icon size={24} className={selectedTriggers.includes(trigger.id) ? 'stroke-current' : 'text-gray-400'} />
                                    <span>{trigger.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* QoL Impact */}
                    <div className={vasScore !== null && vasScore <= 1 ? "opacity-50 pointer-events-none" : ""}>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Impacto en tu Calidad de Vida {vasScore > 1 && <span className="text-red-500">*</span>}
                        </label>
                        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                            {['Nada', 'Poco', 'Mucho'].map(option => (
                                <button
                                    key={option}
                                    onClick={() => setQolImpact(option)}
                                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${qolImpact === option
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button onClick={handleSubmit} className="w-full text-lg py-3 shadow-lg shadow-clinical-blue/20" disabled={submitting}>
                            {submitting ? 'Guardando...' : 'Guardar Registro'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}


