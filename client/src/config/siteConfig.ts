import { type SidebarNavItem } from "@/types";

export interface DashboardConfig {
  sidebarNav: SidebarNavItem[];
}

export const dashboardConfig: DashboardConfig = {
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "terminal",
      items: [],
    },
    {
      title: "Map",
      href: "/dashboard/map",
      icon: "compass",
      items: [],
      audience: ["ADMIN", "USER"],
    },
    {
      title: "Farmers",
      href: "/dashboard/farmers",
      icon: "contact",
      items: [],
      audience: ["ADMIN"],
    },
    {
      title: "Farm Coordinates",
      href: "/dashboard/farms",
      icon: "landPlot",
      items: [],
      audience: ["ADMIN"],
    },
    {
      title: "Land status",
      href: "/dashboard/land-status",
      icon: "table",
      items: [],
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: "users",
      items: [],
      audience: ["ADMIN"],
    },
  ],
};
