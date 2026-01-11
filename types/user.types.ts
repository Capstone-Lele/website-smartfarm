export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string; 
  created_at: string;
  updated_at: string;
};

export type UserRequest = {
  name: string;
  email: string;
  role: string;
  image: string; 
  password: string;
};

export type UserFormInput = {
  name: string;
  email: string;
  role: string;
  image: File | null; 
  password: string;
};

export type UserEditInput = {
  name: string;
  email: string;
  role: string;
  image?: File | null; 
  password?: string; 
};

export type UserResponse = {
  success: boolean;
  message: string;
  data: User[];
};
