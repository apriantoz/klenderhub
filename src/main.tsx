import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx"
import { FooterHub } from "./components/FooterHub.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import Navbar from "./components/Navbar.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider><Theme accentColor="jade" radius="large">
      <Navbar/>
      <App />
      <FooterHub />
    </Theme></ThemeProvider>
  </StrictMode>
)