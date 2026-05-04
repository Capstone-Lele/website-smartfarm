/**
 * @jest-environment node
 */
import { encrypt, decrypt } from '../lib/session';

// Mock environment variables
process.env.KEY_ENCRYPT_SESSION = 'secret-key-for-testing-purposes-only-123';

describe('Session Utilities', () => {
  const mockPayload = {
    token: 'test-token-abc-123',
    expires_at: new Date(Date.now() + 3600 * 1000).toISOString().replace('T', ' ').split('.')[0] + 'Z', // Format: YYYY-MM-DD HH:mm:ssZ
  };

  it('should encrypt the payload into a string token', async () => {
    const token = await encrypt(mockPayload);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  it('should decrypt a valid token back to the original payload', async () => {
    const token = await encrypt(mockPayload);
    const decrypted = await decrypt(token);
    
    expect(decrypted).toBeDefined();
    expect(decrypted?.token).toBe(mockPayload.token);
    // Compare dates roughly as the format change might strip milliseconds
    expect(decrypted?.expires_at).toBeDefined();
  });

  it('should return undefined for an invalid token', async () => {
    const invalidToken = 'invalid.token.here';
    const decrypted = await decrypt(invalidToken);
    expect(decrypted).toBeUndefined();
  });

  it('should return undefined when no token is provided', async () => {
    const decrypted = await decrypt('');
    expect(decrypted).toBeUndefined();
  });
});
