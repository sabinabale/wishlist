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
