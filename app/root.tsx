// app/root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { LinksFunction } from "@remix-run/node";
import { CartProvider } from "./context/CartContext";
import { CartDrawer } from "./components/cart/CartDrawer";
import "./styles/theme.css";

export const links: LinksFunction = () => [
  // No need to include tailwind.css here as it's imported directly above
  { rel: "preconnect", href: "https://cdn.shopify.com/" },
  { 
    rel: "stylesheet", 
    href: "https://cdn.shopify.com/static/fonts/inter/v4/styles.css" 
  },
];
export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-white font-sans antialiased">
        <CartProvider>
          <Outlet />
          <CartDrawer />
        </CartProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

// Error boundary (keeping the same)
export function ErrorBoundary() {
  const error = useRouteError();
  
  let heading = "Unexpected Error";
  let message = "An unexpected error occurred. Please try again later.";
  
  if (isRouteErrorResponse(error)) {
    heading = `${error.status} ${error.statusText}`;
    message = error.data;
  } else if (error instanceof Error) {
    heading = "Application Error";
    message = error.message;
  }
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Error | Tierra Collectives</title>
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-white font-sans antialiased">
        <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-16">
          <div className="max-w-md text-center">
            <h1 className="mb-4 text-3xl font-bold">{heading}</h1>
            <p className="mb-8 text-gray-600">{message}</p>
            <a 
              href="/"
              className="rounded-md bg-black px-4 py-2 text-white transition-colors hover:bg-gray-800"
            >
              Return to Homepage
            </a>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}