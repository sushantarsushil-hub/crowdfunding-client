import { QueryClient } from '@tanstack/react-query';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes fresh data
        gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          // Do not retry authorization or not-found client errors
          if (error?.status === 401 || error?.status === 403 || error?.status === 404) {
            return false;
          }
          return failureCount < 2;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: Always make a new query client
    return makeQueryClient();
  } else {
    // Browser: Make a new query client if we don't already have one
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export const queryClient = getQueryClient();
export default queryClient;
