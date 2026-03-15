import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { loginSchema } from '../../schemas/authSchema';
import { useAuth } from '../../contexts/AuthContext';
import * as authApi from '../../api/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await authApi.login(data);
      const { token, user } = res.data.data;
      login(user, token);
      navigate(user.role === 'admin' ? '/admin/agendamentos' : '/agendamentos');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Scissors className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Cabeleleila Leila</CardTitle>
          <CardDescription>Entre na sua conta para agendar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="seu@email.com" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Senha</Label>
              <Input type="password" placeholder="••••••" {...register('password')} />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Não tem conta?{' '}
            <Link to="/cadastro" className="text-primary hover:underline">Cadastre-se</Link>
          </p>
          <p className="text-center text-xs text-muted-foreground mt-2">
            <Link to="/admin/login" className="hover:underline">Acesso administrativo</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
