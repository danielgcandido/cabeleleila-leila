import { Link, useNavigate } from 'react-router-dom';
import { Scissors, LogOut, Calendar, LayoutDashboard, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';

export default function Header() {
  const { user, isAdmin, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={isAdmin ? '/admin/agendamentos' : '/agendamentos'} className="flex items-center gap-2 font-bold text-primary text-lg">
          <Scissors className="h-5 w-5" />
          Cabeleleila Leila
        </Link>

        {isAuthenticated && (
          <nav className="flex items-center gap-2">
            {isAdmin ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/agendamentos" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Agendamentos
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin/dashboard" className="flex items-center gap-1">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/agendamentos" className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Meus Agendamentos
                  </Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link to="/agendamentos/novo">Novo Agendamento</Link>
                </Button>
              </>
            )}
            <span className="text-sm text-muted-foreground hidden sm:flex items-center gap-1">
              <User className="h-3 w-3" />
              {user?.name?.split(' ')[0]}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
}
