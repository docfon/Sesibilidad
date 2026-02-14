import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { Search, Users, FileText, AlertCircle } from 'lucide-react';

export default function DentistPatientsModule() {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [searching, setSearching] = useState(false);
    const [patient, setPatient] = useState(null);
    const [logs, setLogs] = useState([]);
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState({ diagnosis: '', observation: '' });
    const [submittingNote, setSubmittingNote] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setSearching(true);
        setError('');
        setPatient(null);
        setLogs([]);
        setNotes([]);

        try {
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('email', searchTerm)
                .single();

            if (profileError) {
                if (profileError.code === 'PGRST116') throw new Error('Paciente no encontrado con ese email.');
                throw profileError;
            }

            setPatient(profiles);

            const { data: logsData } = await supabase
                .from('sensitivity_logs')
                .select('*')
                .eq('user_id', profiles.id)
                .order('created_at', { ascending: false });

            setLogs(logsData || []);

            const { data: notesData } = await supabase
                .from('clinical_notes')
                .select('*')
                .eq('patient_id', profiles.id)
                .order('created_at', { ascending: false });

            setNotes(notesData || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setSearching(false);
        }
    };

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!patient) return;
        setSubmittingNote(true);

        try {
            const { error } = await supabase
                .from('clinical_notes')
                .insert({
                    patient_id: patient.id,
                    dentist_id: user.id,
                    diagnosis_confirmed: newNote.diagnosis,
                    observations: newNote.observation
                });

            if (error) throw error;

            const { data: updatedNotes } = await supabase
                .from('clinical_notes')
                .select('*')
                .eq('patient_id', patient.id)
                .order('created_at', { ascending: false });

            setNotes(updatedNotes || []);
            setNewNote({ diagnosis: '', observation: '' });
            alert('Nota clínica guardada');
        } catch (err) {
            alert('Error al guardar nota: ' + err.message);
        } finally {
            setSubmittingNote(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="text-clinical-blue" size={28} />
                    Portal de Pacientes
                </h2>
                <p className="text-gray-500 mt-1">Busca pacientes por email para consultar sus registros y agregar notas clínicas.</p>
            </div>

            {/* Search Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <form onSubmit={handleSearch} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <Input
                            label="Buscar Paciente por Email"
                            placeholder="ejemplo@email.com"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <Button type="submit" disabled={searching} className="flex items-center gap-2">
                            <Search size={18} />
                            {searching ? 'Buscando...' : 'Buscar'}
                        </Button>
                    </div>
                </form>
                {error && <p className="text-red-500 mt-3 text-sm flex items-center gap-1"><AlertCircle size={14} /> {error}</p>}
            </div>

            {/* Patient Details */}
            {patient && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Demographics & Clinical Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-lg mb-4 border-b pb-2">Datos del Paciente</h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="font-medium text-gray-500">Email:</span> {patient.email}</p>
                                <p><span className="font-medium text-gray-500">Nombre:</span> {patient.full_name || 'No registrado'}</p>
                                <p><span className="font-medium text-gray-500">Edad:</span> {patient.age ? `${patient.age} años` : 'No registrado'}</p>
                                <p><span className="font-medium text-gray-500">Género:</span> {patient.gender || 'No registrado'}</p>
                                <p><span className="font-medium text-gray-500">Ciudad:</span> {patient.city || 'No registrada'}</p>
                                <p><span className="font-medium text-gray-500">Frecuencia de Cepillado:</span> {patient.brushing_frequency ? `${patient.brushing_frequency} veces/día` : 'No registrado'}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-lg mb-4 border-b pb-2">Diagnóstico Diferencial</h3>
                            <div className="space-y-3 text-sm">
                                <InfoRow label="Bruxismo" value={patient.has_bruxism} />
                                <InfoRow label="Dieta Ácida" value={patient.acidic_diet_freq} />
                                <InfoRow label="Reflujo Gástrico" value={patient.has_gastric_reflux} />
                                <InfoRow label="Blanqueamiento Reciente" value={patient.recent_whitening} />
                                <InfoRow label="Recesión Gingival" value={patient.gum_recession} />
                                <InfoRow label="Fumador" value={patient.smoker} />
                                <InfoRow label="Caries/Fractura" value={patient.has_caries_or_fracture} />
                            </div>
                        </div>
                    </div>

                    {/* Middle/Right: Logs & Notes */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Sensitivity Logs Summary */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <FileText size={20} className="text-clinical-blue" />
                                Historial de Sensibilidad ({logs.length} registros)
                            </h3>
                            <div className="max-h-60 overflow-y-auto space-y-3">
                                {logs.map((log) => (
                                    <div key={log.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                        <div>
                                            <span className="font-bold text-clinical-blue">VAS: {log.vas_score}</span>
                                            <span className="mx-2 text-gray-400">|</span>
                                            <span className="text-sm">{new Date(log.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {log.triggers && log.triggers.join(', ')}
                                        </div>
                                    </div>
                                ))}
                                {logs.length === 0 && <p className="text-gray-500 italic">No hay registros de sensibilidad.</p>}
                            </div>
                        </div>

                        {/* Clinical Notes Form */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-semibold text-lg mb-4">Notas Clínicas</h3>

                            <form onSubmit={handleAddNote} className="mb-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico Confirmado</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        value={newNote.diagnosis}
                                        onChange={(e) => setNewNote({ ...newNote, diagnosis: e.target.value })}
                                        placeholder="Ej. Hipersensibilidad Dentinaria"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones / Tratamiento</label>
                                    <textarea
                                        className="w-full p-2 border border-gray-300 rounded-md h-24"
                                        value={newNote.observation}
                                        onChange={(e) => setNewNote({ ...newNote, observation: e.target.value })}
                                        placeholder="Detalles del tratamiento o recomendaciones..."
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" disabled={submittingNote}>
                                        Guardar Nota
                                    </Button>
                                </div>
                            </form>

                            <div className="border-t pt-4">
                                <h4 className="font-medium text-sm text-gray-500 mb-2">Notas Anteriores</h4>
                                <div className="space-y-4">
                                    {notes.map(note => (
                                        <div key={note.id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-semibold text-gray-800">{note.diagnosis_confirmed || 'Sin diagnóstico'}</span>
                                                <span className="text-xs text-gray-500">{new Date(note.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-700">{note.observations}</p>
                                        </div>
                                    ))}
                                    {notes.length === 0 && <p className="text-gray-500 text-sm italic">No hay notas clínicas aún.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty state when no patient searched */}
            {!patient && !error && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={28} className="text-clinical-blue" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Busca un paciente</h3>
                    <p className="text-gray-500 text-sm">Ingresa el email del paciente para ver sus datos y registros de sensibilidad.</p>
                </div>
            )}
        </div>
    );
}

function InfoRow({ label, value }) {
    let displayValue = value;
    if (typeof value === 'boolean') {
        displayValue = value ? <span className="text-red-500 font-bold">SÍ</span> : <span className="text-green-600">NO</span>;
    }
    return (
        <div className="flex justify-between items-center border-b border-gray-100 last:border-0 pb-2 last:pb-0">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-gray-900">{displayValue || '-'}</span>
        </div>
    );
}
