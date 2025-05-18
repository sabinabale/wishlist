export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface UsersData {
  users: User[];
}

export interface WishlistData {
  id: string;
  name: string;
  description: string;
  isPublic: boolean;
  shareId?: string;
  products: string[];
  createdAt: string;
}

export interface WishlistsData {
  [userId: string]: WishlistData[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sizes: number[];
  price: number;
  image: string;
  inStock: number;
}

export interface ProductsData {
  products: Product[];
}
