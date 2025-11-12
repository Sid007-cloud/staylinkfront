import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, Mail, BedDouble, Calendar, Shield, Phone, Edit2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const user = authService.getCurrentUser();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editRoomNumber, setEditRoomNumber] = useState(user?.roomNumber || '');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSaveProfile = () => {
    authService.updateUser({
      name: editName,
      phone: editPhone || undefined,
      roomNumber: editRoomNumber || undefined,
    });

    toast({
      title: "Profile updated!",
      description: "Your changes have been saved",
    });

    setEditDialogOpen(false);
    window.location.reload();
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8 space-y-8 max-w-3xl">
        <div className="animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account information</p>
        </div>

        <Card className="shadow-medium animate-scale-in">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-gradient-primary">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge className={user.role === 'admin' ? 'bg-primary' : 'bg-secondary'}>
                    {user.role === 'admin' ? (
                      <>
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3 mr-1" />
                        Guest
                      </>
                    )}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setEditName(user.name);
                  setEditPhone(user.phone || '');
                  setEditRoomNumber(user.roomNumber || '');
                  setEditDialogOpen(true);
                }}
                variant="outline"
                size="sm"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
              )}

              {user.role === 'user' && (
                <>
                  <Separator />
                  
                  {user.hasActiveBooking ? (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-success/10">
                          <BedDouble className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Current Room</p>
                          <p className="font-medium">Room {user.roomNumber}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Stay Duration</p>
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Check-in</p>
                              <p className="font-medium">
                                {user.checkIn ? new Date(user.checkIn).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                            <span className="text-muted-foreground">→</span>
                            <div>
                              <p className="text-xs text-muted-foreground">Check-out</p>
                              <p className="font-medium">
                                {user.checkOut ? new Date(user.checkOut).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <BedDouble className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No active booking</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {user.role === 'user' && (
          <Card className="bg-gradient-primary text-white shadow-medium">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/20">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold mb-1">Need Help?</h3>
                  <p className="text-white/90 text-sm">
                    Contact our 24/7 support team for any assistance during your stay
                  </p>
                  <p className="text-white/90 text-sm mt-2">
                    📞 +91 1234567890 • ✉️ support@hoteleats.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your personal information
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editName">Full Name</Label>
                <Input
                  id="editName"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone">Phone Number</Label>
                <Input
                  id="editPhone"
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="+91 1234567890"
                />
              </div>
              {user.role === 'user' && (
                <div className="space-y-2">
                  <Label htmlFor="editRoomNumber">Room Number</Label>
                  <Input
                    id="editRoomNumber"
                    value={editRoomNumber}
                    onChange={(e) => setEditRoomNumber(e.target.value)}
                    placeholder="e.g., 305"
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="bg-gradient-primary text-white border-0"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Profile;
