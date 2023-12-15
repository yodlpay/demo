import { Flex, MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import Redirect from "./components/Redirect";
import "./index.css";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Transaction from "./pages/Transaction";
import Transactions from "./pages/Transactions";
import reportWebVitals from "./reportWebVitals";
import { theme } from "./styles/theme";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/transactions/:txHash",
    element: <Transaction />,
  },
  {
    path: "/transactions",
    element: <Transactions />,
  },
  {
    path: "/redirect",
    element: <Redirect />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

root.render(
  <React.StrictMode>
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <Flex direction="column" h="100%" w="100%">
        <Header />
        <RouterProvider router={router} />
        <Footer />
      </Flex>
    </MantineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
