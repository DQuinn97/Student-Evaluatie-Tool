import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider";
import { BrowserRouter } from "react-router";
import { DialogProvider } from "./contexts/DialogContext";
import { InputDialog } from "./components/shared/InputDialog";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DialogProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <InputDialog />
      </ThemeProvider>
    </DialogProvider>
  </StrictMode>,
);
