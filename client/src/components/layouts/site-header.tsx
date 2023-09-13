import { MainNav } from "@/components/layouts/main-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActiveUser } from "@/lib/validations/user";
import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_USERS_KEY } from "@/constant/query.constant";

interface SiteHeaderProps {
  activeUser: ActiveUser;
}

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

export function SiteHeader({ activeUser }: SiteHeaderProps) {
  const { user, accessToken } = activeUser;

  const queryClient = useQueryClient();

  const initials = `${user?.firstname.charAt(0) ?? ""} ${
    user?.lastname?.charAt(0) ?? ""
  }`;

  const { mutate } = useMutation({
    mutationFn: logoutMutation,
    onMutate: () => {
      queryClient.setQueryData([QUERY_USERS_KEY], null);
    },
  });

  function handleLogoutClick() {
    mutate(accessToken ?? "");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <MainNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="sa" alt="@shadcn" />

                    <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.firstname}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup></DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a
                    className="w-full outline-none"
                    onClick={handleLogoutClick}
                  >
                    Log out
                    <DropdownMenuShortcut></DropdownMenuShortcut>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
