import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setMessage('');
            setError('');
            setLoading(true);
            const { error } = await resetPassword(email);
            if (error) throw error;
            setMessage('Te hemos enviado un correo para restablecer tu contraseña.');
        } catch (err) {
            setError('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Recuperar Contraseña" subtitle="Ingresa tu email para recibir instrucciones">
            <form onSubmit={handleSubmit}>
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                {message && <div className="text-green-600 text-sm mb-4 bg-green-50 p-2 rounded">{message}</div>}
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Enviando...' : 'Enviar Instrucciones'}
                </Button>

                <div className="mt-6 text-center text-sm">
                    <Link to="/login" className="text-gray-500 hover:text-gray-700">
                        ← Volver al inicio de sesión
                    </Link>
                </div>
            </form>
        </AuthLayout>
    );
}
