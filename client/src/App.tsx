import { usePosts } from "./services/user.services";

function App() {
  const { data, error, isLoading } = usePosts();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.log({ error });
  }
  console.log({ data });
  return <>Hello world </>;
}

export default App;
