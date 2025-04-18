
// Product types
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  sellerId: string;
  upiQr?: string;
}

// Order types
export interface Order {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  productDetails: Product;
  address: string;
  paymentMethod: 'cod' | 'upi';
  status: 'pending' | 'confirmed';
  orderDate: string;
  totalAmount: number;
}

// Products
export const saveProduct = (product: Product) => {
  const products = getProducts();
  products.push(product);
  localStorage.setItem('products', JSON.stringify(products));
};

export const getProducts = (): Product[] => {
  const products = localStorage.getItem('products');
  return products ? JSON.parse(products) : [];
};

export const removeProduct = (productId: string) => {
  const products = getProducts().filter(p => p.id !== productId);
  localStorage.setItem('products', JSON.stringify(products));
};

export const getProduct = (productId: string): Product | undefined => {
  return getProducts().find(p => p.id === productId);
};

// Orders
export const saveOrder = (order: Order) => {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const getOrders = (): Order[] => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};

export const getBuyerOrders = (buyerId: string): Order[] => {
  return getOrders().filter(order => order.buyerId === buyerId);
};

export const getSellerOrders = (sellerId: string): Order[] => {
  return getOrders().filter(order => order.sellerId === sellerId);
};

// User Profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address?: string;
  role: 'buyer' | 'seller';
}

export const saveUserProfile = (profile: UserProfile) => {
  localStorage.setItem(`profile_${profile.id}`, JSON.stringify(profile));
};

export const getUserProfile = (userId: string): UserProfile | null => {
  const profile = localStorage.getItem(`profile_${userId}`);
  return profile ? JSON.parse(profile) : null;
};

