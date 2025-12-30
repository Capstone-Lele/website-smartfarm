export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: string;
    token: string;
    expired_at: string;
}