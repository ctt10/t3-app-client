import "@/styles/globals.css";
import Head from "next/head";

import { Navbar, Footer } from "@/components";
import { CartProvider } from "@/context/CartContext";

import { api } from "@/utils/api";
import { ItemContextProvider } from "@/context/ItemContext";
import { OrderContextProvider } from "@/context/OrderContext";


import { type AppType } from "next/app";


const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className="flex h-full min-h-screen w-screen bg-DarkPurple">
      <Head>
        <title>Frozen Time</title>
        <meta name="description" content="A Frozen Place" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col h-full w-full">
        <CartProvider>  
          <ItemContextProvider>
            <OrderContextProvider>
              <Navbar />
              <Component props={pageProps} />
              <Footer />
            </OrderContextProvider>
          </ItemContextProvider>
        </CartProvider>
      </div>
    </main>
  );
};

export default api.withTRPC(MyApp);