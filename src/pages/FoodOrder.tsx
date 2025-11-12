import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { restaurants, foodItems, FoodItem, orderService } from '@/lib/mockData';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, Clock, Leaf, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FoodOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const user = authService.getCurrentUser();
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(
    location.state?.restaurantId || null
  );
  const [cart, setCart] = useState<Map<string, number>>(new Map());

  useEffect(() => {
    if (!user || user.role !== 'user') {
      navigate('/login');
    } else if (!user.hasActiveBooking) {
      toast({
        title: "No active booking",
        description: "Please book a room first to order food",
        variant: "destructive",
      });
      navigate('/rooms');
    }
  }, [user, navigate, toast]);

  if (!user) return null;

  const restaurantItems = selectedRestaurant
    ? foodItems.filter(item => item.restaurantId === selectedRestaurant)
    : [];

  const addToCart = (itemId: string) => {
    const newCart = new Map(cart);
    newCart.set(itemId, (newCart.get(itemId) || 0) + 1);
    setCart(newCart);
  };

  const removeFromCart = (itemId: string) => {
    const newCart = new Map(cart);
    const currentQty = newCart.get(itemId) || 0;
    if (currentQty > 1) {
      newCart.set(itemId, currentQty - 1);
    } else {
      newCart.delete(itemId);
    }
    setCart(newCart);
  };

  const getCartTotal = () => {
    let total = 0;
    cart.forEach((qty, itemId) => {
      const item = foodItems.find(f => f.id === itemId);
      if (item) total += item.price * qty;
    });
    return total;
  };

  const handlePlaceOrder = () => {
    if (cart.size === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart first",
        variant: "destructive",
      });
      return;
    }

    const restaurant = restaurants.find(r => r.id === selectedRestaurant);
    const orderItems = Array.from(cart.entries()).map(([itemId, qty]) => {
      const item = foodItems.find(f => f.id === itemId)!;
      return {
        name: item.name,
        quantity: qty,
        price: item.price,
      };
    });

    orderService.createOrder({
      userId: user.id,
      restaurantName: restaurant?.name || 'Unknown',
      items: orderItems,
      total: getCartTotal(),
      status: 'pending',
      orderTime: new Date().toISOString(),
      roomNumber: user.roomNumber || '305',
    });

    toast({
      title: "Order placed!",
      description: "Your food will be delivered soon",
    });

    navigate('/orders');
  };

  if (!selectedRestaurant) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <main className="container py-8 space-y-8">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Order Food</h1>
            <p className="text-muted-foreground">Choose a restaurant to start ordering</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
            {restaurants.map((restaurant) => (
              <Card
                key={restaurant.id}
                className="group hover:shadow-medium transition-all cursor-pointer border-2 hover:border-primary/50"
                onClick={() => setSelectedRestaurant(restaurant.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-1">{restaurant.name}</CardTitle>
                      <CardDescription>{restaurant.cuisine}</CardDescription>
                    </div>
                    <Badge className="bg-success text-success-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      {restaurant.rating}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {restaurant.deliveryTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const currentRestaurant = restaurants.find(r => r.id === selectedRestaurant)!;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8 space-y-8">
        {/* Restaurant Header */}
        <div className="animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedRestaurant(null);
              setCart(new Map());
            }}
            className="mb-4"
          >
            ← Back to Restaurants
          </Button>
          
          <div className="bg-gradient-primary rounded-2xl p-8 text-white shadow-medium">
            <h1 className="text-3xl font-bold mb-2">{currentRestaurant.name}</h1>
            <div className="flex items-center gap-4 text-white/90">
              <span>{currentRestaurant.cuisine}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                {currentRestaurant.rating}
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {currentRestaurant.deliveryTime}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold">Menu</h2>
            
            <div className="grid gap-4">
              {restaurantItems.map((item) => {
                const quantity = cart.get(item.id) || 0;
                
                return (
                  <Card key={item.id} className="hover:shadow-soft transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start gap-2">
                            {item.veg && (
                              <Badge variant="outline" className="border-success text-success">
                                <Leaf className="h-3 w-3" />
                              </Badge>
                            )}
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold">₹{item.price}</span>
                            
                            {quantity === 0 ? (
                              <Button
                                onClick={() => addToCart(item.id)}
                                size="sm"
                                className="bg-gradient-primary text-white border-0"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add
                              </Button>
                            ) : (
                              <div className="flex items-center gap-2 bg-primary/10 rounded-lg p-1">
                                <Button
                                  onClick={() => removeFromCart(item.id)}
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="font-bold w-8 text-center">{quantity}</span>
                                <Button
                                  onClick={() => addToCart(item.id)}
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your Cart
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.size === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Your cart is empty
                  </p>
                ) : (
                  <>
                    <div className="space-y-3">
                      {Array.from(cart.entries()).map(([itemId, qty]) => {
                        const item = foodItems.find(f => f.id === itemId)!;
                        return (
                          <div key={itemId} className="flex justify-between text-sm">
                            <span className="flex-1">
                              {item.name} x{qty}
                            </span>
                            <span className="font-medium">₹{item.price * qty}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-2xl text-primary">₹{getCartTotal()}</span>
                    </div>

                    <Button
                      onClick={handlePlaceOrder}
                      className="w-full bg-gradient-primary text-white border-0 hover:opacity-90"
                      size="lg"
                    >
                      Place Order
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      Delivering to Room {user.roomNumber}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FoodOrder;
