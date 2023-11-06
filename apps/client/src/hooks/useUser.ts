import { DashboardContextType } from "@/types";
import { useOutletContext } from "react-router-dom";

export function useUser() {
  return useOutletContext<DashboardContextType>();
}
