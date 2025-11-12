import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Hotel, User, LogOut, ShoppingBag } from 'lucide-react';
import { authService } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

export const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    toast({
      title: "Logged out successfully",
      description: "See you soon!",
    });
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to={user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/'} className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Hotel className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            HotelEats
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {user.role === 'user' && (
                <Link to="/orders">
                  <Button variant="ghost" size="icon">
                    <ShoppingBag className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              <Link to="/profile">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-primary text-white border-0 hover:opacity-90">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
