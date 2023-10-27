import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import {
  Navigate,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";

export default function ErrorElement() {
  const error = useRouteError() as AxiosError;
  const { toast } = useToast();

  if (isRouteErrorResponse(error)) {
    if (error.status === 403) {
      return <Navigate to="/" replace />;
    }

    if (error.status === 404) {
      toast({
        title: "Error",
        description: error?.message ?? "Something went wrong",
        variant: "destructive",
      });

      return <Navigate to="/dashboard/farms" replace />;
    }
  }

  return <div>Something went wrong</div>;
}
