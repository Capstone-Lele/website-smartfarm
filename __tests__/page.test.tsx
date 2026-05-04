import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Page from '../app/page'

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => (
      <OriginalModule.ResponsiveContainer  initialDimension={{ width: 320, height: 200 }}>
        {children}
      </OriginalModule.ResponsiveContainer>
    ),
  };
})

jest.mock('../lib/api/service/guest/guest.service', () => ({
  guestService: {
    getGeneralInfo: jest.fn().mockResolvedValue({}),
  },
}));


 
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe("Page", () => {
  it("renders without crashing", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Page />
      </QueryClientProvider>
    );
  });
});