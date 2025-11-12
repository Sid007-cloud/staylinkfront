import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { rooms, Room } from '@/lib/mockData';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Rooms = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = authService.getCurrentUser();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleBookRoom = (room: Room) => {
    if (!room.available) {
      toast({
        title: "Room not available",
        description: "This room is currently occupied",
        variant: "destructive",
      });
      return;
    }
    setSelectedRoom(room);
    setBookingDialogOpen(true);
  };

  const confirmBooking = () => {
    if (selectedRoom) {
      // Update user with booking info
      authService.updateUser({
        hasActiveBooking: true,
        roomNumber: selectedRoom.number,
        checkIn: new Date().toISOString(),
        checkOut: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      });

      toast({
        title: "Booking confirmed!",
        description: `Room ${selectedRoom.number} has been booked`,
      });

      setBookingDialogOpen(false);
      navigate('/dashboard');
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
          <h1 className="text-3xl font-bold mb-2">Available Rooms</h1>
          <p className="text-muted-foreground">Choose your perfect stay</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className={`hover:shadow-medium transition-all ${
                !room.available ? 'opacity-60' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">Room {room.number}</CardTitle>
                    <CardDescription className="text-lg">{room.type}</CardDescription>
                  </div>
                  <Badge
                    className={
                      room.available
                        ? 'bg-success text-success-foreground'
                        : 'bg-destructive text-destructive-foreground'
                    }
                  >
                    {room.available ? 'Available' : 'Occupied'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Up to {room.capacity} guests</span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Amenities:</p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="gap-1">
                        <Check className="h-3 w-3" />
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-primary">₹{room.price}</span>
                    <span className="text-muted-foreground">/ night</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleBookRoom(room)}
                  disabled={!room.available || user.hasActiveBooking}
                  className="w-full bg-gradient-primary text-white border-0 hover:opacity-90"
                  size="lg"
                >
                  {user.hasActiveBooking
                    ? 'Already Booked'
                    : room.available
                    ? 'Book Now'
                    : 'Not Available'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              You're about to book {selectedRoom?.type} (Room {selectedRoom?.number})
            </DialogDescription>
          </DialogHeader>
          
          {selectedRoom && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Type</span>
                <span className="font-medium">{selectedRoom.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room Number</span>
                <span className="font-medium">{selectedRoom.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price per night</span>
                <span className="font-medium">₹{selectedRoom.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-in</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-out</span>
                <span className="font-medium">
                  {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmBooking}
              className="bg-gradient-primary text-white border-0"
            >
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rooms;
