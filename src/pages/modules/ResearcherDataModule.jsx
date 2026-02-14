import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Area, AreaChart
} from 'recharts';
import { BarChart3, Activity, TrendingUp, Zap } from 'lucide-react';

const COLORS = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];
const VAS_COLORS = ['#10B981', '#22C55E', '#84CC16', '#EAB308', '#F59E0B', '#F97316', '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D'];

export default function ResearcherDataModule() {
    const [loading, setLoading] = useState(true);
    const [profiles, setProfiles] = useState([]);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({
        totalPatients: 0,
        avgAge: 0,
        totalLogs: 0,
        avgVAS: 0,
        smokersPct: 0,
        bruxismPct: 0
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            // ONLY fetch patients (exclude dentists & researchers)
            const { data: profilesData, error: profilesError } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'patient');

            const { data: logsData, error: logsError } = await supabase
                .from('sensitivity_logs')
                .select('*')
                .order('created_at', { ascending: true });

            if (profilesError) throw profilesError;
            if (logsError) throw logsError;

            const patients = profilesData || [];
            const allLogs = logsData || [];

            setProfiles(patients);
            setLogs(allLogs);
            calculateStats(patients, allLogs);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (patients, allLogs) => {
        const total = patients.length;
        const avgAge = total > 0 ? patients.reduce((acc, curr) => acc + (curr.age || 0), 0) / total : 0;
        const smokers = patients.filter(p => p.smoker).length;
        const bruxism = patients.filter(p => p.has_bruxism).length;
        const avgVAS = allLogs.length > 0
            ? allLogs.reduce((acc, l) => acc + (l.vas_score || 0), 0) / allLogs.length
            : 0;

        setStats({
            totalPatients: total,
            avgAge: avgAge.toFixed(1),
            totalLogs: allLogs.length,
            avgVAS: avgVAS.toFixed(1),
            smokersPct: total > 0 ? ((smokers / total) * 100).toFixed(1) : '0',
            bruxismPct: total > 0 ? ((bruxism / total) * 100).toFixed(1) : '0'
        });
    };

    // ── Chart Data Preparation ──

    // 1. VAS Score Distribution (histogram)
    const vasDistribution = Array.from({ length: 11 }, (_, i) => ({
        score: i.toString(),
        count: logs.filter(l => l.vas_score === i).length
    }));

    // 2. Triggers Frequency
    const triggersMap = {};
    logs.forEach(log => {
        if (log.triggers && Array.isArray(log.triggers)) {
            log.triggers.forEach(t => {
                triggersMap[t] = (triggersMap[t] || 0) + 1;
            });
        }
    });
    const triggersChartData = Object.entries(triggersMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

    // 3. QoL Impact Distribution
    const qolMap = {};
    logs.forEach(log => {
        const impact = log.qol_impact || 'No especificado';
        qolMap[impact] = (qolMap[impact] || 0) + 1;
    });
    const qolChartData = Object.entries(qolMap).map(([name, value]) => ({ name, value }));

    // 4. VAS Over Time (daily average)
    const vasByDate = {};
    logs.forEach(log => {
        const date = new Date(log.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
        if (!vasByDate[date]) vasByDate[date] = { total: 0, count: 0 };
        vasByDate[date].total += (log.vas_score || 0);
        vasByDate[date].count += 1;
    });
    const vasTimelineData = Object.entries(vasByDate).map(([date, { total, count }]) => ({
        date,
        promedio: parseFloat((total / count).toFixed(1))
    }));

    // 5. Demographics: City & Gender (patients only)
    const cityData = profiles.reduce((acc, curr) => {
        const city = curr.city || 'Desconocido';
        acc[city] = (acc[city] || 0) + 1;
        return acc;
    }, {});
    const cityChartData = Object.entries(cityData).map(([name, value]) => ({ name, value }));

    const genderData = profiles.reduce((acc, curr) => {
        const gender = curr.gender || 'Desconocido';
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
    }, {});
    const genderChartData = Object.entries(genderData).map(([name, value]) => ({ name, value }));

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando datos del estudio...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="text-clinical-blue" size={28} />
                    Datos del Estudio RWE
                </h2>
                <p className="text-gray-500 mt-1">Análisis agregado de datos de sensibilidad dental — solo pacientes.</p>
            </div>

            {/* ── Key Metrics ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <MetricCard label="Pacientes" value={stats.totalPatients} color="text-clinical-blue" />
                <MetricCard label="Registros" value={stats.totalLogs} color="text-indigo-600" />
                <MetricCard label="VAS Promedio" value={stats.avgVAS} color="text-red-500" />
                <MetricCard label="Edad Promedio" value={stats.avgAge} color="text-teal-600" />
                <MetricCard label="Fumadores" value={`${stats.smokersPct}%`} color="text-orange-500" />
                <MetricCard label="Bruxismo" value={`${stats.bruxismPct}%`} color="text-purple-600" />
            </div>

            {/* ══════ SENSITIVITY SECTION ══════ */}
            <div className="border-t pt-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                    <Activity size={20} className="text-red-500" />
                    Análisis de Sensibilidad
                </h3>
            </div>

            {/* Row 1: VAS Distribution + VAS Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* VAS Score Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-semibold mb-1 text-gray-800">Distribución de Intensidad (VAS 0-10)</h3>
                    <p className="text-xs text-gray-400 mb-4">Cuántos registros por nivel de dolor</p>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={vasDistribution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="score" fontSize={12} />
                                <YAxis allowDecimals={false} fontSize={12} />
                                <Tooltip formatter={(value) => [`${value} registros`, 'Cantidad']} />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {vasDistribution.map((entry, index) => (
                                        <Cell key={`vas-${index}`} fill={VAS_COLORS[index]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* VAS Over Time */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-semibold mb-1 text-gray-800">Sensibilidad Promedio en el Tiempo</h3>
                    <p className="text-xs text-gray-400 mb-4">Evolución del VAS promedio diario</p>
                    <div className="h-56">
                        {vasTimelineData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={vasTimelineData}>
                                    <defs>
                                        <linearGradient id="vasGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis dataKey="date" fontSize={11} />
                                    <YAxis domain={[0, 10]} fontSize={12} />
                                    <Tooltip formatter={(value) => [`${value}`, 'VAS Promedio']} />
                                    <Area type="monotone" dataKey="promedio" stroke="#EF4444" strokeWidth={2} fill="url(#vasGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                Sin datos de sensibilidad registrados aún.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Row 2: Triggers + QoL Impact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Triggers Frequency */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-semibold mb-1 text-gray-800 flex items-center gap-2">
                        <Zap size={16} className="text-amber-500" />
                        Detonantes Más Frecuentes
                    </h3>
                    <p className="text-xs text-gray-400 mb-4">Factores que activan la sensibilidad</p>
                    <div className="h-56">
                        {triggersChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={triggersChartData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis type="number" allowDecimals={false} fontSize={12} />
                                    <YAxis dataKey="name" type="category" width={80} fontSize={11} />
                                    <Tooltip formatter={(value) => [`${value} veces`, 'Frecuencia']} />
                                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                                        {triggersChartData.map((entry, index) => (
                                            <Cell key={`trig-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                Sin datos de detonantes registrados.
                            </div>
                        )}
                    </div>
                </div>

                {/* Quality of Life Impact */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-semibold mb-1 text-gray-800">Impacto en Calidad de Vida</h3>
                    <p className="text-xs text-gray-400 mb-4">Cuánto afecta la sensibilidad la vida diaria</p>
                    <div className="h-56">
                        {qolChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={qolChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                    >
                                        {qolChartData.map((entry, index) => (
                                            <Cell key={`qol-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} registros`, 'Cantidad']} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                                Sin datos de impacto registrados.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ══════ DEMOGRAPHICS SECTION ══════ */}
            <div className="border-t pt-4">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-4">
                    <TrendingUp size={20} className="text-indigo-500" />
                    Demografía de Pacientes
                </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* City Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-semibold mb-4 text-gray-800">Distribución por Ciudad</h3>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cityChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" fontSize={12} />
                                <YAxis allowDecimals={false} fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="value" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Gender Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-semibold mb-4 text-gray-800">Distribución por Género</h3>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={genderChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                >
                                    {genderChartData.map((entry, index) => (
                                        <Cell key={`gender-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-sm text-indigo-800">
                <p>
                    <strong>{stats.totalPatients}</strong> pacientes inscritos con <strong>{stats.totalLogs}</strong> registros de sensibilidad.
                    VAS promedio general: <strong>{stats.avgVAS}/10</strong>.
                </p>
            </div>
        </div>
    );
}

function MetricCard({ label, value, color }) {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</h3>
            <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
        </div>
    );
}
