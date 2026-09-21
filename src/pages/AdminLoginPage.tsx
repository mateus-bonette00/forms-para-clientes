import React, { useState } from 'react';
import { Lock, User, KeyRound, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import api from '../services/api';

export const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Informe o usuário e a senha.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/admin/login', { username, password });
      if (response.data?.token) {
        localStorage.setItem('admin_token', response.data.token);
        localStorage.setItem('admin_user', JSON.stringify(response.data.user));
        toast.success('Login realizado com sucesso!');
        window.location.hash = '#/admin/dashboard';
      }
    } catch (err: any) {
      console.error('Erro no login:', err);
      const msg = err.response?.data?.error || 'Credenciais inválidas. Verifique seu usuário e senha.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-white">Painel do Desenvolvedor</h1>
          <p className="text-xs text-slate-400">
            Acesso restrito para gerenciar os briefings e fotos recebidas
          </p>
        </div>

        <Card className="border border-slate-800/80 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Usuário Administrador"
              placeholder="Ex: admin"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Senha de Acesso"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<KeyRound className="w-4 h-4" />}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Acessar Painel
              </Button>
            </div>
          </form>
        </Card>

        <div className="text-center">
          <a
            href="#/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao formulário do cliente
          </a>
        </div>
      </div>
    </div>
  );
};

