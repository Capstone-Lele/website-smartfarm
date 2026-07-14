export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    expires_at: string;
    type: string;
  };
}

export interface UserInfo {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export type VerifyOtpSend = {
  otp: string;
  email: string;
};
