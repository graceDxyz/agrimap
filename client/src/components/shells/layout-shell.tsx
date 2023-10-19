import logoimg from "@/assets/logo-leaf.png";
import { dashboardConfig } from "@/config/siteConfig";
import { Link, Outlet } from "react-router-dom";
import { SidebarNav } from "../layouts/sidebar-nav";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

export function DashboardShell() {
  // const queryClient = useQueryClient();
  // queryClient.prefetchQuery({
  //   queryKey: [QUERY_ADDRESSES_KEY],
  //   queryFn: fetchAddress,
  // });

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
