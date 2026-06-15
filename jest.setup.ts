import '@testing-library/jest-dom';

// Suppress console output during tests for clean test output
global.console.log = jest.fn();
global.console.warn = jest.fn();
global.console.error = jest.fn();

// Mock URL.createObjectURL and revokeObjectURL since JSDOM does not support them
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();
import { TextEncoder, TextDecoder } from 'util';

process.env.KEY_ENCRYPT_SESSION = process.env.KEY_ENCRYPT_SESSION || 'super-secret-key-at-least-32-characters-long';
process.env.COOKIE_NAME = process.env.COOKIE_NAME || 'auth-token';

global.TextEncoder = TextEncoder;
Object.assign(global, { TextDecoder, TextEncoder });

if (typeof structuredClone === 'undefined') {
  global.structuredClone = (obj: any) => JSON.parse(JSON.stringify(obj));
}

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
  })),
}));

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname() {
    return '/';
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

if (typeof window !== 'undefined') {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  global.ResizeObserver = ResizeObserver;

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}
