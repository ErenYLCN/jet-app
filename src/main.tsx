import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

import Home from "./components/home/Home.tsx";

import "./styles/_global.css";
import "./styles/_variables.css";
import "./styles/_mixins.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Home />
    </Provider>
  </StrictMode>
);
