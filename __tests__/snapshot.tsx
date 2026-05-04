import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Page from '../app/page'

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
 
it('renders homepage unchanged', () => {
  const { container } = render(
    <QueryClientProvider client={queryClient}>
      <Page />
    </QueryClientProvider>
  )
  expect(container).toMatchSnapshot()
})