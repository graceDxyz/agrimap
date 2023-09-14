import { Link, Outlet } from "react-router-dom";
import { Button } from "../ui/button";
import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_USERS_KEY } from "@/constant/query.constant";
import { ActiveUser } from "@/lib/validations/user";
import { ScrollArea } from "../ui/scroll-area";
import { SidebarNav } from "../layouts/sidebar-nav";
import { dashboardConfig } from "@/config/siteConfig";
import { Icons } from "../icons";
import { Separator } from "../ui/separator";

function logoutMutation(accessToken: string) {
  return api.post(
    "/sessions/current",
    {},
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
}

export function DashboardShell() {
  const queryClient = useQueryClient();
  const { data } = useQuery<ActiveUser>([QUERY_USERS_KEY]);
  const { mutate, isLoading } = useMutation({
    mutationFn: logoutMutation,
    onMutate: () => {
      queryClient.setQueryData([QUERY_USERS_KEY], null);
    },
  });

  function handleLogoutClick() {
    mutate(data?.accessToken ?? "");
  }
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-5">
        <aside className="fixed  z-30 -ml-2 hidden h-screen w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
          <ScrollArea className="py-6 pr-6 lg:py-8">
            <div className="h-20 flex bg-red-200">
              <Link
                aria-label="Home page"
                to="/"
                className="hidden items-center space-x-2 lg:flex"
              >
                <Icons.logo className="h-6 w-6" aria-hidden="true" />
                <span className="hidden font-bold lg:inline-block">
                  Budgetto
                </span>
              </Link>
            </div>

            <Separator />
            <SidebarNav items={dashboardConfig.sidebarNav} className="p-1" />
          </ScrollArea>
        </aside>
        <main className="flex w-full flex-col overflow-hidden pl-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// function DashboardShellLoader() {
//   return (
//     <div className="flex min-h-screen flex-col">
//       <header className="sticky top-0 z-50 w-full border-b bg-background">
//         <div className="container flex h-16 items-center">
//           <MainNav />
//           <div className="flex flex-1 items-center justify-end space-x-4">
//             <nav className="flex items-center space-x-2">
//               <Skeleton className="h-8 w-8 rounded-full" />
//             </nav>
//           </div>
//         </div>
//       </header>
//       <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-5">
//         <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
//           <ScrollArea className="py-6 pr-6 lg:py-8">
//             <SidebarNav items={dashboardConfig.sidebarNav} isLoading />
//           </ScrollArea>
//         </aside>
//         <main className="flex w-full flex-col overflow-hidden">
//           <Shell variant="sidebar">
//             <PageHeader
//               id="dashboard-stores-page-header"
//               aria-labelledby="dashboard-stores-page-header-heading"
//             >
//               <div className="flex space-x-4 justify-between">
//                 <Skeleton className="h-10 w-64" />
//                 <Skeleton className="h-10 w-40" />
//               </div>
//               <Skeleton className="h-5 w-36" />
//             </PageHeader>
//             <section></section>
//           </Shell>
//         </main>
//       </div>
//     </div>
//   );
// }
