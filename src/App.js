import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./component/pages/Home";
import AboutPage from "./component/pages/About";
import ContactPage from "./component/pages/Contact";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> }, // route 1
  { path: "/about", element: <AboutPage /> }, // route 2
  { path: "/contact", element: <ContactPage /> }, // route 3
]);

function App() {
  // const [journals, setJournals] = useState([]);

  // const getJournals = async () => {
  //   try {
  //     const response = await api.get("/journal");
  //     setJournals(response.data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   getJournals();
  // }, []);

  return <RouterProvider router={router} />;
}

export default App;
