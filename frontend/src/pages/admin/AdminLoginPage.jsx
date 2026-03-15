import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Shield } from 'lucide-react';
import { loginSchema } from '../../schemas/authSchema';
import { useAuth } from '../../contexts/AuthContext';
import * as authApi from '../../api/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await authApi.login(data);
      const { token, user } = res.data.data;
      if (user.role !== 'admin') {
        toast.error('Acesso negado. Apenas administradores.');
        return;
      }
      login(user, token);
      navigate('/admin/agendamentos');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <div className="relative">
              <Scissors className="h-8 w-8 text-primary" />
              <Shield className="h-4 w-4 text-primary absolute -bottom-1 -right-1" />
            </div>
          </div>
          <CardTitle>Painel Administrativo</CardTitle>
          <CardDescription>Acesso exclusivo para administradores</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="admin@cabeleleila.com" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Senha</Label>
              <Input type="password" placeholder="••••••" {...register('password')} />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Acessar painel'}
            </Button>
          </form>
          <p className="text-center text-xs text-muted-foreground mt-4">
            <Link to="/login" className="hover:underline">Voltar ao login de clientes</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
