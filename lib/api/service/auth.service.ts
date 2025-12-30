import { LoginRequest, LoginResponse } from '@/types/auth.types';
import { apiClient } from '../client';
import { API_ENDPOINTS } from '../endpoint';
import { setCookie, deleteCookie } from 'cookies-next';

export const authService = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        // const response = await apiClient.post<LoginResponse>(
        //     API_ENDPOINTS.AUTH.LOGIN,
        //     credentials
        // );

        await new Promise(resolve => setTimeout(resolve, 5000));

        // dummy response for testing
        const response: LoginResponse = {
            status: 'success',
            token: 'dummy_token_123456',
            expired_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 jm
        };
        
        if (response.token && response.expired_at) {
            setCookie('session_token', response.token, {
                expires: new Date(response.expired_at),
                path: '/',
                sameSite: 'lax',
            });
        }
        
        return response;
    },

    logout: async (): Promise<string> => {
        // await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
        deleteCookie('session_token', { path: '/' });

        return "success";
    }

};