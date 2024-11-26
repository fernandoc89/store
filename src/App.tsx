import { Helmet, HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router";
import "./index.css";
import { router } from "./routes";

export function App() {
  return (
    <HelmetProvider>
      <Helmet titleTemplate="%s | Store" />
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}
