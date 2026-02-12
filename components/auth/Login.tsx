
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { MailIcon, LockIcon } from '../icons';
import Announcements from '../shared/Announcements';

interface LoginProps {
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { login, loginAdmin } = useApp();

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await login({ email, password });
      if (!user) {
        setError('Email ou senha inválidos. Por favor, tente novamente.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const admin = await loginAdmin(adminCode);
      if (!admin) {
        setError('Código de administrador inválido.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-brand-primary/20 via-brand-light to-brand-secondary/20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-5xl font-serif text-brand-dark">Vera Magrin</h1>
            <p className="text-brand-text mt-2">Seja bem-vinda de volta!</p>
        </div>
        <Announcements />
        <Card className="mt-6">
          <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">{showAdminLogin ? 'Acesso Admin' : 'Login'}</h2>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
          
          {showAdminLogin ? (
             <form onSubmit={handleAdminSubmit} className="space-y-6">
              <Input
                id="adminCode"
                label="Código de Administrador"
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                required
                icon={<LockIcon className="h-5 w-5 text-gray-400" />}
              />
              <Button type="submit" isLoading={isLoading}>
                Entrar como Admin
              </Button>
            </form>
          ) : (
            <form onSubmit={handleUserSubmit} className="space-y-6">
              <Input
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                icon={<MailIcon className="h-5 w-5 text-gray-400" />}
              />
              <Input
                id="password"
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                icon={<LockIcon className="h-5 w-5 text-gray-400" />}
              />
              <Button type="submit" isLoading={isLoading}>
                Entrar
              </Button>
            </form>
          )}

          <div className="text-center mt-6 text-sm">
            <p className="mb-2">
              Não tem uma conta?{' '}
              <button onClick={onSwitchToRegister} className="font-semibold text-brand-primary hover:underline">
                Registre-se
              </button>
            </p>
            <button onClick={() => { setShowAdminLogin(!showAdminLogin); setError(''); }} className="font-semibold text-gray-500 hover:underline">
              {showAdminLogin ? 'Acesso Cliente' : 'Acesso Admin'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
