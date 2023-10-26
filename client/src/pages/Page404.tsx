import { useToast } from "@/components/ui/use-toast";
import { AxiosError } from "axios";
import { Navigate, useRouteError } from "react-router-dom";

export function Page404() {
  const error = useRouteError() as AxiosError;
  const { toast } = useToast();

  toast({
    title: "Error",
    description: error?.message ?? "Something went wrong",
    variant: "destructive",
  });

  return <Navigate to="/dashboard/farms" replace />;
}
