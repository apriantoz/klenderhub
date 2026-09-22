import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { FooterHub } from "./components/FooterHub.tsx"
//import { ThemeProvider } from "@/components/theme-provider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <App />
      <FooterHub/>
  </StrictMode>
)
