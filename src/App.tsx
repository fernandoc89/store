import { QueryClientProvider } from "@tanstack/react-query";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme/theme-provider';
import './index.css';
import { queryClient } from "./lib/react-query";
import { router } from './routes';

export function App() {
  return (
    <HelmetProvider>
      <ThemeProvider storageKey="storeshop-theme" defaultTheme="dark">
        <Helmet titleTemplate="%s | Store" />
        <Toaster richColors />
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}


