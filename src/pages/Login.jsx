import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            const { error } = await signIn(email, password);
            if (error) throw error;
            navigate('/dashboard');
        } catch (err) {
            setError('Error al iniciar sesión: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Bienvenido de nuevo" subtitle="Ingresa para ver tu progreso">
            <form onSubmit={handleSubmit}>
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    label="Contraseña"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <div className="flex justify-end mb-4">
                    <Link to="/forgot-password" className="text-sm text-clinical-blue hover:underline">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Cargando...' : 'Iniciar Sesión'}
                </Button>

                <div className="mt-6 text-center text-sm">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/register" className="text-clinical-blue font-medium hover:underline">
                        Regístrate aquí
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
