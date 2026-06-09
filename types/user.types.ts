export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  permission: string[];
  image: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type UserDetail = {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  permission: string[];
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
  permission: string[];
};

export type UserEditInput = {
  name: string;
  email: string;
  image?: File | null;
  password?: string;
  permission?: string[];
};

export type UserResponse = {
  success: boolean;
  message: string;
  data: User[];
};

export type UserOnlyResponse = {
  success: boolean;
  message: string;
  data: UserDetail[];
};
