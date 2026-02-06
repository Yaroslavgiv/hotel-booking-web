import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';
import { apolloClient } from '../apollo/client';
import { UserProvider } from '../context/UserContext';
import { ToastProvider } from '../context/ToastContext';

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  return (
    <ApolloProvider client={apolloClient}>
      <ToastProvider>
        <UserProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </UserProvider>
      </ToastProvider>
    </ApolloProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
