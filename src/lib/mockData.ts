// Mock data for the app
export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
  deliveryTime: string;
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  veg: boolean;
  rating: number;
}

export interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  capacity: number;
  amenities: string[];
  image: string;
  available: boolean;
}

export interface Order {
  id: string;
  userId: string;
  restaurantName: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'preparing' | 'on-the-way' | 'delivered' | 'cancelled';
  orderTime: string;
  roomNumber: string;
}

export const restaurants: Restaurant[] = [
  {
    id: '1',
    name: 'The Grand Kitchen',
    cuisine: 'Multi-Cuisine',
    rating: 4.5,
    image: '/placeholder.svg',
    deliveryTime: '20-30 mins',
  },
  {
    id: '2',
    name: 'Spice Garden',
    cuisine: 'Indian',
    rating: 4.7,
    image: '/placeholder.svg',
    deliveryTime: '25-35 mins',
  },
  {
    id: '3',
    name: 'Ocean Breeze',
    cuisine: 'Seafood',
    rating: 4.6,
    image: '/placeholder.svg',
    deliveryTime: '30-40 mins',
  },
  {
    id: '4',
    name: 'Quick Bites',
    cuisine: 'Fast Food',
    rating: 4.3,
    image: '/placeholder.svg',
    deliveryTime: '15-25 mins',
  },
];

export const foodItems: FoodItem[] = [
  // The Grand Kitchen
  {
    id: '1',
    restaurantId: '1',
    name: 'Grilled Chicken Steak',
    description: 'Tender grilled chicken with herbs and vegetables',
    price: 450,
    image: '/placeholder.svg',
    category: 'Main Course',
    veg: false,
    rating: 4.5,
  },
  {
    id: '2',
    restaurantId: '1',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with caesar dressing',
    price: 280,
    image: '/placeholder.svg',
    category: 'Salads',
    veg: true,
    rating: 4.3,
  },
  // Spice Garden
  {
    id: '3',
    restaurantId: '2',
    name: 'Butter Chicken',
    description: 'Creamy tomato-based curry with tender chicken',
    price: 380,
    image: '/placeholder.svg',
    category: 'Main Course',
    veg: false,
    rating: 4.8,
  },
  {
    id: '4',
    restaurantId: '2',
    name: 'Paneer Tikka Masala',
    description: 'Cottage cheese in rich spicy gravy',
    price: 320,
    image: '/placeholder.svg',
    category: 'Main Course',
    veg: true,
    rating: 4.6,
  },
  {
    id: '5',
    restaurantId: '2',
    name: 'Garlic Naan',
    description: 'Soft bread with garlic and butter',
    price: 60,
    image: '/placeholder.svg',
    category: 'Breads',
    veg: true,
    rating: 4.7,
  },
  // Ocean Breeze
  {
    id: '6',
    restaurantId: '3',
    name: 'Grilled Salmon',
    description: 'Fresh salmon with lemon butter sauce',
    price: 650,
    image: '/placeholder.svg',
    category: 'Main Course',
    veg: false,
    rating: 4.7,
  },
  {
    id: '7',
    restaurantId: '3',
    name: 'Seafood Platter',
    description: 'Assorted fresh seafood',
    price: 850,
    image: '/placeholder.svg',
    category: 'Main Course',
    veg: false,
    rating: 4.8,
  },
  // Quick Bites
  {
    id: '8',
    restaurantId: '4',
    name: 'Chicken Burger',
    description: 'Juicy chicken patty with fresh veggies',
    price: 220,
    image: '/placeholder.svg',
    category: 'Burgers',
    veg: false,
    rating: 4.4,
  },
  {
    id: '9',
    restaurantId: '4',
    name: 'French Fries',
    description: 'Crispy golden fries',
    price: 120,
    image: '/placeholder.svg',
    category: 'Sides',
    veg: true,
    rating: 4.2,
  },
  {
    id: '10',
    restaurantId: '4',
    name: 'Veg Pizza',
    description: 'Loaded with fresh vegetables',
    price: 350,
    image: '/placeholder.svg',
    category: 'Pizza',
    veg: true,
    rating: 4.5,
  },
];

export const rooms: Room[] = [
  {
    id: '1',
    number: '101',
    type: 'Deluxe Room',
    price: 3500,
    capacity: 2,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'],
    image: '/placeholder.svg',
    available: true,
  },
  {
    id: '2',
    number: '205',
    type: 'Executive Suite',
    price: 6500,
    capacity: 3,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Kitchen'],
    image: '/placeholder.svg',
    available: true,
  },
  {
    id: '3',
    number: '305',
    type: 'Presidential Suite',
    price: 12000,
    capacity: 4,
    amenities: ['WiFi', 'AC', 'TV', 'Mini Bar', 'Balcony', 'Kitchen', 'Jacuzzi', 'Living Room'],
    image: '/placeholder.svg',
    available: false,
  },
  {
    id: '4',
    number: '102',
    type: 'Standard Room',
    price: 2500,
    capacity: 2,
    amenities: ['WiFi', 'AC', 'TV'],
    image: '/placeholder.svg',
    available: true,
  },
];

// Mock orders storage
let mockOrders: Order[] = [];

export const orderService = {
  createOrder: (order: Omit<Order, 'id'>): Order => {
    const newOrder: Order = {
      ...order,
      id: Math.random().toString(36).substr(2, 9),
    };
    mockOrders.push(newOrder);
    return newOrder;
  },

  getOrders: (): Order[] => {
    return mockOrders;
  },

  getUserOrders: (userId: string): Order[] => {
    return mockOrders.filter(order => order.userId === userId);
  },

  updateOrderStatus: (orderId: string, status: Order['status']): Order | null => {
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      return order;
    }
    return null;
  },
};
