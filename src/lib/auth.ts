// Mock authentication - Frontend only
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  phone?: string;
  hasActiveBooking?: boolean;
  roomNumber?: string;
  checkIn?: string;
  checkOut?: string;
}

const STORAGE_KEY = 'hotelapp_user';

export const authService = {
  login: (email: string, password: string): User | null => {
    // Mock login - accept any credentials
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'user',
      hasActiveBooking: !email.includes('admin'),
      roomNumber: !email.includes('admin') ? '305' : undefined,
      checkIn: !email.includes('admin') ? new Date().toISOString() : undefined,
      checkOut: !email.includes('admin') ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  signup: (email: string, password: string, name: string): User => {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      role: 'user',
      hasActiveBooking: false,
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  updateUser: (updates: Partial<User>) => {
    const user = authService.getCurrentUser();
    if (user) {
      const updatedUser = { ...user, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    }
    return null;
  },
};
