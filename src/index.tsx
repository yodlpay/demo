import { Flex, MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import Home from "./components/Home";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { theme } from "./styles/theme";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Redirect from "./components/Redirect";
import NotFound from "./components/NotFound";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/redirect",
    element: <Redirect />,
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
