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
      title: "Farmers",
      href: "/dashboard/farmers",
      icon: "contact",
      items: [],
      audience: ["ADMIN"],
    },
    {
      title: "Farm Coordinates",
      href: "/dashboard/farms",
      icon: "locateFixed",
      items: [],
      audience: ["ADMIN"],
    },
    {
      title: "Martgage Land",
      href: "/dashboard/mortgages",
      icon: "table",
      items: [],
    },
    {
      title: "Statistic Report",
      href: "/dashboard/reports",
      icon: "fileSpreadSheet",
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
