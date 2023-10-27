import { AxiosError } from "axios";
import { Link, useRouteError } from "react-router-dom";
import { buttonVariants } from "../ui/button";

export default function ErrorElement() {
  const error = useRouteError();

  if (error instanceof AxiosError) {
    return (
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 h-[calc(100vh-30vh)] items-center flex justify-center">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-foreground">
            {error.response?.status ?? 500}
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-foreground md:text-4xl">
            {error.response?.statusText ?? "Something's missing."}
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Sorry, {error.message ?? "we can't find that page"}. You'll find
            lots to explore on the dashboard page.{" "}
          </p>
          <Link
            to="/dashboard"
            replace
            className={buttonVariants({
              variant: "default",
            })}
          >
            <span>Back to dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return <div>Something went wrong</div>;
}
