import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

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

export default function Onboarding() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [city, setCity] = useState('');
    const [brushing, setBrushing] = useState('');
    const [smoker, setSmoker] = useState(false);
    const [hasCaries, setHasCaries] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return setError('Usuario no autenticado');

        setLoading(true);
        setError('');

        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    age: parseInt(age),
                    gender,
                    city,
                    brushing_frequency: brushing,
                    smoker,
                    has_caries_or_fracture: hasCaries
                });

            if (error) throw error;
            navigate('/dashboard');
        } catch (err) {
            setError('Error al guardar perfil: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Completa tu Perfil" subtitle="Ayúdanos a conocerte mejor (Solo una vez)">
            <form onSubmit={handleSubmit}>
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

                <div className="space-y-4 mb-6 mt-4">
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

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Guardando...' : 'Comenzar'}
                </Button>
            </form>
        </AuthLayout>
    );
}
