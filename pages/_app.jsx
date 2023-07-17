import Head from "next/head";
import "../styles/HomePage/Style.css";
import "../styles/ProductPage/style.css";
import "../styles/AdminPage/App.css";
import "../styles/DynamicPage/clientSingleproduct/style.css";
import "../styles/DynamicPage/adminSingleproduct/style.css";
import "../styles/DynamicPage/transactionreceipt/style.css";
import "../styles/CartPage/style.css";
import "../styles/LoginReg/LoginStyle.css";
import "../styles/OrderPage/style.css";
import "../styles/Paginate/pagenate.css";
import { AppProps } from "next/app";
import { AuthGuard } from "./api/auth/AuthGuard.";
import { createContext, useEffect, useState } from "react";
import Loader from "../Components/Loader";
import { getSessionUser, logInGuest } from "../Services/functions";
import { useRouter } from "next/router";

import { Analytics } from "@vercel/analytics/react";
// mantine
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
export const CartQuantityContext = createContext();
export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [preRender, setPreRender] = useState(false);
  const [cartQty, setCartQty] = useState(0);
  const [blockedUsers, setBlockedUsers] = useState(false);

  useEffect(() => {
    setPreRender(true);

    async function fetchSessionUser() {
      await logInGuest();
      const userData = await getSessionUser();
      // console.log(userData);
      if (userData && userData?.user) {
        setCartQty(userData?.user.cart.length);
      }
      if (userData?.user?.block === true) {
        router.push("/Login");
      }
    }
    fetchSessionUser();
  }, [router]);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta name="description" content="Description" />
        <meta name="keywords" content="Keywords" />
        <title>E-commerce</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="https://res.cloudinary.com/dnfa3ujys/image/upload/v1685984511/WhatsApp_Image_2023-06-05_at_3.43.15_PM_xrkz2v.jpg"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="https://res.cloudinary.com/dnfa3ujys/image/upload/v1685984511/WhatsApp_Image_2023-06-05_at_3.43.15_PM_xrkz2v.jpg"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link
          rel="apple-touch-icon"
          href="https://res.cloudinary.com/dnfa3ujys/image/upload/v1685984511/WhatsApp_Image_2023-06-05_at_3.43.15_PM_xrkz2v.jpg"
        ></link>
        <meta name="theme-color" content="white" />
      </Head>
      <MantineProvider withNormalizeCSS withGlobalStyles>
        <Notifications position="top-right" zIndex={2077} />
        <CartQuantityContext.Provider value={{ cartQty, setCartQty }}>
          {preRender ? (
            <>
              {Component.requireAuth ? (
                <AuthGuard>
                  <Component {...pageProps} />
                  <Analytics />
                </AuthGuard>
              ) : (
                <>
                  <Component {...pageProps} />
                  <Analytics />
                </>
              )}
            </>
          ) : (
            <div style={{ marginTop: "200px" }}>
              <Loader />
            </div>
          )}
        </CartQuantityContext.Provider>
      </MantineProvider>
    </>
  );
}