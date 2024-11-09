import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./component/pages/Home";
import AboutPage from "./component/pages/About";
import ContactPage from "./component/pages/Contact";
import RootLayout from "./component/Root";

const router = createBrowserRouter([
  {
    path: "/", // root layout
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> }, // route 1
      { path: "/about", element: <AboutPage /> }, // route 2
      { path: "/contact", element: <ContactPage /> }, // route 3
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
