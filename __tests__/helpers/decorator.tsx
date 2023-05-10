import { useState, type PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from "@trpc/client";
import SuperJSON from 'superjson';

import { Navbar } from "@/components";
import { trpcReact } from '@/utils/api';

import { CartProvider } from '@/context/CartContext';
import { ItemContextProvider } from "@/context/ItemContext";
import { OrderContextProvider } from "@/context/OrderContext";

/**
 * This file sets up a wrapper around main App component
 *   this setups up Context so that trpc can be tested 
 */

export function TrpcWrapper({ children }: PropsWithChildren<object>) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpcReact.createClient({
      transformer: SuperJSON,
      links: [
        httpBatchLink({
          url: 'http://localhost:3000/api/trpc',
        }),
      ],
    }),
  );

  return (
    <trpcReact.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {/* Main Application to be tested */}
        <CartProvider>
          <ItemContextProvider>
            <OrderContextProvider>
              <Navbar />
              {children}
            </OrderContextProvider>
          </ItemContextProvider>
        </CartProvider>
      </QueryClientProvider>
    </trpcReact.Provider>
  );
}