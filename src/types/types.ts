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
  price: number;
  image: string;
  inStock: number;
}

export interface ProductsData {
  products: Product[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartsData {
  carts: Cart[];
}

export interface DetailProps {
  label: string;
  value: string;
}

export type PageProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
