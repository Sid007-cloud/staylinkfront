import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Hotel, UtensilsCrossed, BedDouble, Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="container py-20 text-center space-y-8 animate-fade-in">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-white shadow-medium animate-float">
            <Hotel className="h-12 w-12 text-primary" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Welcome to <span className="bg-white/20 px-4 py-2 rounded-xl">HotelEats</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-8">
          Experience luxury stays with the convenience of ordering delicious food right to your room
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/signup">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-medium">
              Get Started
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="container pb-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-white/95 backdrop-blur shadow-medium hover:shadow-soft transition-all animate-slide-up">
            <CardContent className="p-8 text-center space-y-4">
              <div className="p-4 rounded-xl bg-gradient-primary w-fit mx-auto">
                <BedDouble className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Comfortable Rooms</h3>
              <p className="text-muted-foreground">
                Choose from our range of well-appointed rooms designed for your comfort
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur shadow-medium hover:shadow-soft transition-all animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-8 text-center space-y-4">
              <div className="p-4 rounded-xl bg-gradient-secondary w-fit mx-auto">
                <UtensilsCrossed className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Order Food</h3>
              <p className="text-muted-foreground">
                Browse multiple restaurants and order your favorite meals to your room
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur shadow-medium hover:shadow-soft transition-all animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-8 text-center space-y-4">
              <div className="p-4 rounded-xl bg-gradient-accent w-fit mx-auto">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">Premium Experience</h3>
              <p className="text-muted-foreground">
                Enjoy seamless service with real-time order tracking and 24/7 support
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
