import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { createBrowserRouter, RouterProvider } from "react-router";

import RestaurantsPage from "./features/restaurants/pages/RestaurantsPage.tsx";

import "./styles/_global.css";
import "./styles/_variables.css";
import "./styles/_mixins.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RestaurantsPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
