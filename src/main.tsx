import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { Theme, ThemePanel } from "@radix-ui/themes";
import App from "./App.tsx"
import { FooterHub } from "./components/FooterHub.tsx"
//import { ThemeProvider } from "@/components/theme-provider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme accentColor="jade" radius="large">
      <App />
      <FooterHub />
      <ThemePanel />
    </Theme>
  </StrictMode>
)