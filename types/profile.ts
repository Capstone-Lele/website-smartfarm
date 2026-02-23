export type Profile = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};


export type ProfileResponse = {
  success: boolean;
  message: string;
  data: Profile[];
};

export type ProfileEditInput = {
  name?: string;
  password?: string;
  image?: File | string | null;
  confirmPassword?: string;
};