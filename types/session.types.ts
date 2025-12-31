export type SessionPayload = {
  token: string;
  expires_at: string;
};

export type DecryptedSession = {
    id: string;
    name: string;
    email: string;
    role: string;
    // image: string;
}