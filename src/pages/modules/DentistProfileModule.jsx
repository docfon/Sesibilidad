import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { User, LogOut, MapPin, Briefcase, Edit2, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CITIES = [
    { value: 'Bogotá', label: 'Bogotá' },
    { value: 'Medellín', label: 'Medellín' },
    { value: 'Cali', label: 'Cali' },
    { value: 'Barranquilla', label: 'Barranquilla' },
    { value: 'Bucaramanga', label: 'Bucaramanga' },
    { value: 'Cartagena', label: 'Cartagena' },
    { value: 'Otro', label: 'Otra Ciudad' },
];

export default function DentistProfileModule() {
    const { user, signOut, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [fullName, setFullName] = useState('');
    const [profession, setProfession] = useState('');
    const [city, setCity] = useState('');

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

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setProfile(data);
                setFullName(data.full_name || '');
                setProfession(data.profession || '');
                setCity(data.city || '');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        if (profile) {
            setFullName(profile.full_name || '');
            setProfession(profile.profession || '');
            setCity(profile.city || '');
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
                full_name: fullName,
                profession,
                city,
            };

            const { error } = await supabase
                .from('profiles')
                .upsert(updates);

            if (error) throw error;

            await fetchProfile();
            if (refreshProfile) await refreshProfile();
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
                        <Stethoscope size={40} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{profile?.full_name || user?.email}</h3>
                        <p className="text-blue-100 text-sm font-medium">{profile?.profession || 'Odontólogo'}</p>
                        <p className="text-blue-200 text-xs mt-0.5">{user?.email}</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileField icon={User} label="Nombre Completo" value={profile?.full_name || 'No registrado'} />
                    <ProfileField icon={Briefcase} label="Profesión" value={profile?.profession || 'No registrada'} />
                    <ProfileField icon={MapPin} label="Ciudad" value={profile?.city || 'No registrada'} />
                    <ProfileField icon={Stethoscope} label="Rol" value="Odontólogo" />
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Perfil Profesional">
                <form onSubmit={handleSaveProfile} className="space-y-4 py-2">
                    <Input
                        label="Nombre Completo"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Juan Pérez"
                        required
                    />

                    <Input
                        label="Profesión / Especialidad"
                        type="text"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        placeholder="Ej. Odontólogo General, Endodoncista"
                        required
                    />

                    <Select
                        label="Ciudad"
                        options={CITIES}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />

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
    );
}
