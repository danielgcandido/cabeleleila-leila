import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { registerSchema } from '../../schemas/authSchema';
import { useAuth } from '../../contexts/AuthContext';
import * as authApi from '../../api/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await authApi.register(data);
      const { token, user } = res.data.data;
      login(user, token);
      navigate('/agendamentos');
      toast.success('Cadastro realizado com sucesso!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erro ao realizar cadastro');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <Scissors className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>Cadastre-se para agendar seus serviços</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Nome completo</Label>
              <Input placeholder="Maria Silva" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" placeholder="seu@email.com" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <Label>Telefone</Label>
              <Input placeholder="(14) 99999-9999" {...register('phone')} />
              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <Label>Senha</Label>
              <Input type="password" placeholder="Mínimo 6 caracteres" {...register('password')} />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <Label>Confirmar senha</Label>
              <Input type="password" placeholder="Repita a senha" {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Cadastrando...' : 'Criar conta'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Já tem conta?{' '}
            <Link to="/login" className="text-primary hover:underline">Entrar</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
