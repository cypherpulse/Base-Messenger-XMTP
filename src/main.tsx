import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AppKitProvider } from "./lib/wallet/config";

createRoot(document.getElementById("root")!).render(
  <AppKitProvider>
    <App />
  </AppKitProvider>
);