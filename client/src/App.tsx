import SignInPage from "@/pages/SignInPage";
import { useGetUsers } from "@/services/user.services";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const { data, error, isLoading } = useGetUsers();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.log({ error });
  }
  console.log({ data });

  const routes = createBrowserRouter([
    {
      index: true,
      element: <SignInPage />,
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
