import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { useAuth, UserType } from '../contexts/AuthContext';

interface RegisterPageProps {
  onShowLogin: () => void;
}

export function RegisterPage({ onShowLogin }: RegisterPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    phone: '',
    password: '',
    type: '' as UserType | ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleTypeSelect = (type: UserType) => {
    setFormData(prev => ({
      ...prev,
      type
    }));
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type) {
      setError('Selecione o tipo de cadastro');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        cpf: formData.cpf,
        phone: formData.phone,
        type: formData.type,
        password: formData.password
      });
      
      if (!success) {
        setError('Erro ao criar conta');
      }
    } catch (err) {
      setError('Erro ao criar conta');
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
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nome :"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-200 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-600"
            required
          />

          <input
            type="text"
            name="cpf"
            placeholder="CPF / CNPJ :"
            value={formData.cpf}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              cpf: formatCPF(e.target.value)
            }))}
            className="w-full px-4 py-3 bg-gray-200 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-600"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="e-mail :"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-200 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-600"
            required
          />

          <input
            type="tel"
            name="phone"
            placeholder="celular:"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              phone: formatPhone(e.target.value)
            }))}
            className="w-full px-4 py-3 bg-gray-200 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-600"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Senha :"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-200 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-600"
            required
            minLength={6}
          />

          <div className="pt-6">
            <p className="text-center text-gray-700 font-medium mb-4">
              Cadastre-se como:
            </p>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleTypeSelect('vendedor')}
                className={`flex-1 py-3 px-6 rounded-full font-medium transition-colors ${
                  formData.type === 'vendedor'
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Vendedor
              </button>
              <button
                type="button"
                onClick={() => handleTypeSelect('cliente')}
                className={`flex-1 py-3 px-6 rounded-full font-medium transition-colors ${
                  formData.type === 'cliente'
                    ? 'bg-green-500 text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                Cliente
              </button>
            </div>
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
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onShowLogin}
            className="text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            Já tem uma conta? Faça login
          </button>
        </div>
      </div>
    </div>
  );
}