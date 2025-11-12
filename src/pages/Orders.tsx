import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { orderService, Order } from '@/lib/mockData';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ArrowLeft, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Orders = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = authService.getCurrentUser();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
    } else {
      setOrders(orderService.getUserOrders(user.id));
    }
  }, [user, navigate]);

  const handleCancelOrder = (orderId: string) => {
    const order = orderService.updateOrderStatus(orderId, 'cancelled');
    if (order) {
      setOrders(orderService.getUserOrders(user!.id));
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully",
      });
    }
  };

  if (!user) return null;

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-accent text-accent-foreground';
      case 'preparing': return 'bg-primary/10 text-primary';
      case 'on-the-way': return 'bg-secondary text-secondary-foreground';
      case 'delivered': return 'bg-success text-success-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8 space-y-8">
        <div className="animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track your food orders</p>
        </div>

        {orders.length === 0 ? (
          <Card className="animate-scale-in">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No orders yet</h3>
              <p className="text-muted-foreground">
                Start by ordering some delicious food!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 animate-slide-up">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-soft transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg">
                        {order.restaurantName}
                      </CardTitle>
                      <CardDescription>
                        Order #{order.id.slice(0, 8)} • Room {order.roomNumber}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.orderTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-medium">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Total</span>
                    <span className="text-xl font-bold text-primary">
                      ₹{order.total}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Orders;
