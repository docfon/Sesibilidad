import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import { User, LogOut, Briefcase, Edit2, FlaskConical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ResearcherProfileModule() {
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
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white flex items-center gap-4">
                    <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                        <FlaskConical size={40} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{profile?.full_name || user?.email}</h3>
                        <p className="text-indigo-100 text-sm font-medium">{profile?.profession || 'Investigador'}</p>
                        <p className="text-indigo-200 text-xs mt-0.5">{user?.email}</p>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileField icon={User} label="Nombre Completo" value={profile?.full_name || 'No registrado'} />
                    <ProfileField icon={Briefcase} label="Profesión / Área" value={profile?.profession || 'No registrada'} />
                    <ProfileField icon={FlaskConical} label="Rol" value="Investigador" />
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Perfil de Investigador">
                <form onSubmit={handleSaveProfile} className="space-y-4 py-2">
                    <Input
                        label="Nombre Completo"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ej. Dr. María García"
                        required
                    />

                    <Input
                        label="Profesión / Área de Investigación"
                        type="text"
                        value={profession}
                        onChange={(e) => setProfession(e.target.value)}
                        placeholder="Ej. Epidemióloga, Investigador en Salud Oral"
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
            <div className="text-indigo-600 bg-indigo-50 p-2 rounded-lg">
                <Icon size={20} />
            </div>
            <div>
                <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-0.5">{label}</div>
                <div className="font-semibold text-gray-900">{value || 'No registrado'}</div>
            </div>
        </div>
    );
}
