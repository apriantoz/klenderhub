import { createBrowserRouter, RouterProvider } from "react-router"
import Home from "./pages/Home"
import Login from "./pages/Login"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
])

export default function App() {
  return <RouterProvider router={router} />
}