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
      title: "Martgage Land",
      href: "/dashboard/lands",
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
    },
    {
      title: "Logout",
      href: "/dashboard/logout",
      icon: "logout",
      items: [],
    },
  ],
};
