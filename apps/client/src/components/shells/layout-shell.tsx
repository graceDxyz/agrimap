import logoimg from "@/assets/logo-leaf.png";
import { dashboardConfig } from "@/config/siteConfig";
import { Link, Outlet } from "react-router-dom";
import { SidebarNav } from "../layouts/sidebar-nav";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { useGetAuth } from "@/services/session.service";
import { DashboardContextType } from "@/types";

export function DashboardShell() {
  const { user, logout } = useGetAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-5">
        <aside className="fixed top-0 z-30 -ml-2 hidden h-screen w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <ScrollArea className="py-6 pr-6 lg:py-8">
            <div className="h-20 flex">
              <Link
                aria-label="Home page"
                to="/"
                className="hidden items-center space-x-2 lg:flex"
              >
                <img className="h-20 w-20" src={logoimg} alt="agrimap" />
                <span className="hidden font-bold lg:inline-block">
                  AgriMap
                </span>
              </Link>
            </div>

            <Separator />
            <SidebarNav items={dashboardConfig.sidebarNav} className="p-1" />
          </ScrollArea>
        </aside>
        <main className="flex w-full flex-col overflow-hidden pl-2">
          <Outlet context={{ user, logout } satisfies DashboardContextType} />
        </main>
      </div>
    </div>
  );
}