
import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { UserIcon, MailIcon, LockIcon, PhoneIcon } from '../icons';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const user = await register({ name, email, phone, password });
      if (!user) {
        setError('Não foi possível criar a conta. O email pode já estar em uso.');
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
            <p className="text-brand-text mt-2">Crie sua conta para agendar seu horário.</p>
        </div>
        <Card>
          <h2 className="text-2xl font-bold text-center text-brand-dark mb-6">Criar Conta</h2>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="name"
              label="Nome Completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              icon={<UserIcon className="h-5 w-5 text-gray-400" />}
            />
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
              id="phone"
              label="WhatsApp (Telefone)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              icon={<PhoneIcon className="h-5 w-5 text-gray-400" />}
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
            <div className="pt-2">
              <Button type="submit" isLoading={isLoading}>
                Registrar
              </Button>
            </div>
          </form>
          <p className="text-center mt-6 text-sm">
            Já tem uma conta?{' '}
            <button onClick={onSwitchToLogin} className="font-semibold text-brand-primary hover:underline">
              Faça login
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Register;
