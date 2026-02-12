
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { LockIcon } from '../icons';

interface LoginProps {
  onBackToHome: () => void;
}

const Login: React.FC<LoginProps> = ({ onBackToHome }) => {
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginAdmin } = useApp();
  
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
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <h1 className="text-5xl font-serif text-brand-dark">Vera Magrin</h1>
        </div>
        <Card>
          <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">Acesso Administrador</h2>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
          
          <form onSubmit={handleAdminSubmit} className="space-y-6">
            <Input
              id="adminCode"
              label="Código de Acesso"
              type="password"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              required
              icon={<LockIcon className="h-5 w-5 text-gray-400" />}
            />
            <Button type="submit" isLoading={isLoading}>
              Entrar
            </Button>
          </form>

          <div className="text-center mt-6 text-sm">
            <button onClick={onBackToHome} className="font-semibold text-gray-500 hover:underline">
              Voltar para o site
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;