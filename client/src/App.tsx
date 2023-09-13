import SignInPage from "@/pages/SignInPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const routes = createBrowserRouter([
    {
      index: true,
      element: <SignInPage />,
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
