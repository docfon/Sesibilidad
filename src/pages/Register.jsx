import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) {
            return setError('La contraseña debe tener al menos 6 caracteres');
        }
        if (password !== confirmPassword) {
            return setError('Las contraseñas no coinciden');
        }

        try {
            setError('');
            setLoading(true);
            const { data, error } = await signUp(email, password);
            if (error) throw error;

            if (data?.user && !data?.session) {
                setError('Registro exitoso. Por favor revisa tu correo para confirmar tu cuenta antes de iniciar sesión.');
                return;
            }

            navigate('/onboarding');
        } catch (err) {
            setError('Error al registrarse: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Crear Cuenta" subtitle="Únete al estudio DentalSens-RWE">
            <form onSubmit={handleSubmit}>
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Input label="Confirmar Contraseña" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Registrando...' : 'Crear Cuenta'}
                </Button>

                <div className="mt-6 text-center text-sm">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-clinical-blue font-medium hover:underline">
                        Inicia sesión
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
