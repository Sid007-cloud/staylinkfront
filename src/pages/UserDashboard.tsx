import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, BedDouble, Clock, MapPin, ChevronRight, ShoppingBag } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-hero rounded-2xl p-8 text-white shadow-medium animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-white/90">Ready to order something delicious?</p>
        </div>

        {/* Active Booking */}
        {user.hasActiveBooking && (
          <Card className="shadow-soft animate-slide-up border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <BedDouble className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Current Stay</CardTitle>
                    <CardDescription>Room {user.roomNumber}</CardDescription>
                  </div>
                </div>
                <Badge className="bg-success text-success-foreground">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Check-in</p>
                    <p className="font-medium">{user.checkIn ? new Date(user.checkIn).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Check-out</p>
                    <p className="font-medium">{user.checkOut ? new Date(user.checkOut).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/food-order">
            <Card className="group hover:shadow-medium transition-all cursor-pointer border-2 hover:border-primary/50 h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-gradient-primary group-hover:scale-110 transition-transform">
                    <UtensilsCrossed className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">Order Food</h3>
                    <p className="text-muted-foreground text-sm">
                      {user.hasActiveBooking 
                        ? 'Browse restaurants & order to your room'
                        : 'Book a room first to order food'}
                    </p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/rooms">
            <Card className="group hover:shadow-medium transition-all cursor-pointer border-2 hover:border-secondary/50 h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-gradient-secondary group-hover:scale-110 transition-transform">
                    <BedDouble className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">Browse Rooms</h3>
                    <p className="text-muted-foreground text-sm">
                      Explore our comfortable rooms
                    </p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/orders">
            <Card className="group hover:shadow-medium transition-all cursor-pointer border-2 hover:border-accent/50 h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-gradient-accent group-hover:scale-110 transition-transform">
                    <ShoppingBag className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">My Orders</h3>
                    <p className="text-muted-foreground text-sm">
                      View your order history
                    </p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/profile">
            <Card className="group hover:shadow-medium transition-all cursor-pointer border-2 hover:border-primary/50 h-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-gradient-primary group-hover:scale-110 transition-transform">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">My Profile</h3>
                    <p className="text-muted-foreground text-sm">
                      Manage your account
                    </p>
                  </div>
                  <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {!user.hasActiveBooking && (
          <Card className="bg-accent/10 border-accent/20">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-muted-foreground">
                💡 <strong>Tip:</strong> Book a room to start ordering delicious food to your doorstep!
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
