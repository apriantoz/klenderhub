import { createBrowserRouter, RouterProvider } from "react-router"
import Home from "./pages/Home"
import Login from "./pages/Login"
import SchedulePage from "./pages/SchedulePage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path:"/schedule",
    element:<SchedulePage/>
  }
])

export default function App() {
  return <RouterProvider router={router} />
}