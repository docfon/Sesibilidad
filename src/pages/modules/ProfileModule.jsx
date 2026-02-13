import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { User, LogOut, MapPin, Calendar, Activity, Cigarette, AlertCircle, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CITIES = [
    { value: 'Bogotá', label: 'Bogotá' },
    { value: 'Medellín', label: 'Medellín' },
    { value: 'Cali', label: 'Cali' },
    { value: 'Barranquilla', label: 'Barranquilla' },
    { value: 'Otro', label: 'Otra Ciudad' },
];

const GENDERS = [
    { value: 'Masculino', label: 'Masculino' },
    { value: 'Femenino', label: 'Femenino' },
    { value: 'Otro', label: 'Otro' },
];

const BRUSHING_FREQ = [
    { value: '1', label: '1 vez al día' },
    { value: '2', label: '2 veces al día' },
    { value: '3', label: '3 o más veces al día' },
];

export default function ProfileModule() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [city, setCity] = useState('');
    const [brushing, setBrushing] = useState('');
    const [smoker, setSmoker] = useState(false);
    const [hasCaries, setHasCaries] = useState(false);

    useEffect(() => {
        if (user) fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // Ignore 'row not found' error

            if (data) {
                setProfile(data);
                // Initialize form state
                setAge(data.age || '');
                setGender(data.gender || '');
                setCity(data.city || '');
                setBrushing(data.brushing_frequency || '');
                setSmoker(data.smoker || false);
                setHasCaries(data.has_caries_or_fracture || false);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        // Form is already populated from fetchProfile, but good to ensure latest state if needed
        if (profile) {
            setAge(profile.age || '');
            setGender(profile.gender || '');
            setCity(profile.city || '');
            setBrushing(profile.brushing_frequency || '');
            setSmoker(profile.smoker || false);
            setHasCaries(profile.has_caries_or_fracture || false);
        }
        setIsEditModalOpen(true);
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const updates = {
                id: user.id,
                age: parseInt(age),
                gender,
                city,
                brushing_frequency: brushing,
                smoker,
                has_caries_or_fracture: hasCaries,
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(updates);

            if (error) throw error;

            await fetchProfile(); // Refresh data
            setIsEditModalOpen(false);
        } catch (err) {
            setError('Error al actualizar perfil: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando perfil...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Mi Perfil</h2>
                <div className="flex gap-2">
                    <Button onClick={handleEditClick} variant="secondary" className="flex items-center gap-2">
                        <Edit2 size={18} />
                        <span className="hidden sm:inline">Editar</span>
                    </Button>
                    <Button onClick={handleLogout} variant="ghost" className="flex items-center gap-2 text-red-500 hover:bg-red-50 hover:text-red-600">
                        <LogOut size={18} />
                        <span className="hidden sm:inline">Cerrar Sesión</span>
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div className="bg-gradient-to-r from-clinical-blue to-[#0096c7] p-8 text-white flex items-center gap-4">
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                        <User size={40} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{user?.email}</h3>
                        <p className="text-blue-100 text-sm font-medium">Participante ID: {user?.id?.substring(0, 8)}</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileField icon={Calendar} label="Edad" value={profile?.age ? `${profile.age} años` : 'No registrado'} />
                    <ProfileField icon={User} label="Género" value={profile?.gender} />
                    <ProfileField icon={MapPin} label="Ubicación" value={profile?.city} />
                    <ProfileField icon={Activity} label="Frecuencia Cepillado" value={profile?.brushing_frequency} />
                    <ProfileField icon={Cigarette} label="Fumador" value={profile?.smoker ? 'Sí' : 'No'} />
                    <ProfileField icon={AlertCircle} label="Diagnóstico Reciente" value={profile?.has_caries_or_fracture ? 'Sí' : 'No'} />
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800 flex gap-3">
                <div className="shrink-0 mt-0.5">
                    <AlertCircle size={18} />
                </div>
                <p>
                    Sus datos demográficos son utilizados únicamente para fines estadísticos del estudio "DentalSens-RWE".
                </p>
            </div>

            {/* Edit Profile Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Perfil">
                <form onSubmit={handleSaveProfile} className="space-y-4 py-2">
                    <Input
                        label="Edad"
                        type="number"
                        min="1"
                        max="120"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        required
                    />

                    <Select
                        label="Género"
                        options={GENDERS}
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                    />

                    <Select
                        label="Ubicación"
                        options={CITIES}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />

                    <Select
                        label="Frecuencia de Cepillado"
                        options={BRUSHING_FREQ}
                        value={brushing}
                        onChange={(e) => setBrushing(e.target.value)}
                        required
                    />

                    <div className="space-y-4 pt-2">
                        <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={smoker}
                                onChange={(e) => setSmoker(e.target.checked)}
                                className="w-5 h-5 text-clinical-blue rounded focus:ring-clinical-blue"
                            />
                            <span className="text-gray-700 font-medium">¿Eres fumador?</span>
                        </label>

                        <label className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={hasCaries}
                                onChange={(e) => setHasCaries(e.target.checked)}
                                className="w-5 h-5 text-clinical-blue rounded focus:ring-clinical-blue"
                            />
                            <span className="text-gray-700 font-medium">¿Diagnóstico reciente de caries/fractura?</span>
                        </label>
                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <div className="pt-4">
                        <Button type="submit" className="w-full" disabled={saving}>
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

function ProfileField({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all">
            <div className="text-clinical-blue bg-blue-50 p-2 rounded-lg">
                <Icon size={20} />
            </div>
            <div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">{label}</div>
                <div className="font-semibold text-gray-900">{value || 'No registrado'}</div>
            </div>
        </div>
    )
}
