import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
  onShowRegister: () => void;
  onLoginSuccess?: () => void; // opcional, caso queira redirecionar
}

export function LoginPage({ onShowRegister, onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Email ou senha incorretos');
      }
      // Se quiser redirecionar após login com token válido:
      // if (success && token && onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-6 rounded-full">
              <Logo showText={false} className="scale-150" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ZÉ DA HORTA</h1>
          <p className="text-gray-600">Insira um e-mail para entrar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="E-mail :"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-200 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-600"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Senha :"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-200 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-600"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium py-3 px-6 rounded-full transition-colors"
          >
            {isLoading ? 'Entrando...' : 'Logar'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="text-gray-500 font-medium">OU</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <button
            onClick={onShowRegister}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-8 rounded-full transition-colors"
          >
            Cadastre-se
          </button>
        </div>

        <div className="mt-8 text-center space-y-2 text-sm text-gray-500">
          <p><strong>Usuários de teste:</strong></p>
          <p>Cliente: cliente@teste.com / 123456</p>
          <p>Vendedor: vendedor@teste.com / 123456</p>
        </div>
      </div>
    </div>
  );
}