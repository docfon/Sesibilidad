import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function UpdatePassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                // If accessed directly without a recovery link, this might not work as expected
                // depending on how Supabase handles the recovery link redirect.
                // Usually, the hash contains the access token which Supabase client handles automatically.
            }
        });
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError('Las contraseñas no coinciden');
        }

        setLoading(true);
        setError('');

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError('Error al actualizar: ' + error.message);
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <AuthLayout title="Nueva Contraseña" subtitle="Ingresa tu nueva contraseña segura">
            <form onSubmit={handleUpdate}>
                <Input
                    label="Nueva Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                />
                <Input
                    label="Confirmar Contraseña"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                />

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </Button>
            </form>
        </AuthLayout>
    );
}
