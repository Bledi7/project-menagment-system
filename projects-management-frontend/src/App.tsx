/**
 * Main App Component
 * Integrates Event Bus, Theme, and all global providers
 */

import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { router } from './routes';
import { useThemeStore } from './theme';
import { useEventBus, EventCategory } from './eventBus/hooks';
import { emitToast } from './eventBus';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry on 401 errors (unauthorized)
        if (error?.response?.status === 401) {
          return false;
        }
        return failureCount < 1;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // Don't retry on 401 errors
        if (error?.response?.status === 401) {
          return false;
        }
        return failureCount < 1;
      },
    },
  },
});

// Toast integration with Event Bus
function ToastListener() {
  useEventBus(EventCategory.TOAST, 'show', () => {
    // Toast will be handled by react-hot-toast in the Toaster component
    // We can emit to toast here if needed
  });

  return null;
}

// Error handler integration
function ErrorListener() {
  useEventBus(EventCategory.ERROR, 'error', (event) => {
    const payload = event.payload as { error: Error | string; context?: string };
    const message = payload.error instanceof Error ? payload.error.message : payload.error;
    emitToast('error', message || 'An error occurred');
  });

  return null;
}

function App() {
  const { resolvedTheme } = useThemeStore();

  return (
    <QueryClientProvider client={queryClient}>
      <div className={resolvedTheme === 'dark' ? 'dark' : ''}>
        <RouterProvider router={router} />
        <ToastListener />
        <ErrorListener />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: resolvedTheme === 'dark' ? '#1f2937' : '#fff',
              color: resolvedTheme === 'dark' ? '#fff' : '#000',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </div>
    </QueryClientProvider>
  );
}

export default App;
