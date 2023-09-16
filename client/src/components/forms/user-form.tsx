import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { QUERY_USERS_KEY } from "@/constant/query.constant";
import { useBoundStore } from "@/lib/store";
import { Role, createUserSchema } from "@/lib/validations/user";
import { useGetAuth } from "@/services/session.service";
import { createUser, deleteUser, updateUser } from "@/services/user.service";
import { Mode } from "@/types";
import { CreateInputs, User } from "@/types/user.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface DialogHeaderDetail {
  title: string;
  description?: string;
  form?: JSX.Element;
}

export function UserDialog() {
  const { user } = useGetAuth();
  const { mode } = useBoundStore((state) => state.user);
  const isOpen = mode !== "view";

  const modeToTitle: Record<Mode, DialogHeaderDetail> = {
    view: {
      title: "View User",
      description: "View user details.",
    },
    create: {
      title: "Add User",
      description: "Create a new user.",
      form: <CreateUserForm token={user?.accessToken ?? ""} />,
    },
    update: {
      title: "Update User",
      description: "Update user information.",
      form: <UpdateUserForm token={user?.accessToken ?? ""} />,
    },
    delete: {
      title: "Are you absolutely sure?",
      description: "Delete user data (cannot be undone).",
      form: <DeleteUserForm token={user?.accessToken ?? ""} />,
    },
  };

  const { title, description, form } = modeToTitle[mode];

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description} </AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />
        <div>{form}</div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function CreateUserForm({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setMode } = useBoundStore((state) => state.user);
  const roles = Object.values(Role.Values);

  const form = useForm<CreateInputs>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: "USER",
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: createUser,
    onSuccess: ({ data }) => {
      queryClient.setQueriesData([QUERY_USERS_KEY], (prev: unknown) => {
        const categories = prev as User[];
        return [data, ...categories];
      });

      handleCancelClick();
      toast({
        title: "User successfully",
        description: `user ${data.email} created successfully`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateInputs) {
    mutate({ token, data });
  }

  function handleCancelClick() {
    setMode({ mode: "view" });
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firstname</FormLabel>
              <FormControl>
                <Input placeholder="firstname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lastname</FormLabel>
              <FormControl>
                <Input placeholder="lastname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((value, index) => (
                    <SelectItem key={index} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <AlertDialogFooter>
          <Button
            type="button"
            disabled={isLoading}
            variant={"outline"}
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Icons.plus className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Add
            <span className="sr-only">Add</span>
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}

function UpdateUserForm({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setMode, user } = useBoundStore((state) => state.user);
  const roles = Object.values(Role.Values);

  const form = useForm<CreateInputs>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      role: "USER",
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: updateUser,
    onSuccess: ({ data }) => {
      queryClient.setQueriesData([QUERY_USERS_KEY], (prev: unknown) => {
        const categories = prev as User[];
        return [data, ...categories];
      });

      handleCancelClick();
      toast({
        title: "User successfully",
        description: `user ${data.email} created successfully`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateInputs) {
    mutate({ token, id: user?.id as string, data });
  }

  function handleCancelClick() {
    setMode({ mode: "view" });
    form.reset();
  }

  useEffect(() => {
    if (user) {
      form.reset({
        ...user,
        password: user.password as string,
      });
    }
  }, [user]);

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firstname</FormLabel>
              <FormControl>
                <Input placeholder="firstname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lastname</FormLabel>
              <FormControl>
                <Input placeholder="lastname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {roles.map((value, index) => (
                    <SelectItem key={index} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <AlertDialogFooter>
          <Button
            type="button"
            disabled={isLoading}
            variant={"outline"}
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Icons.plus className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Add
            <span className="sr-only">Add</span>
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}

function DeleteUserForm({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, setMode } = useBoundStore((state) => state.user);

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteUser,
    onSuccess: ({ data }) => {
      queryClient.setQueriesData([QUERY_USERS_KEY], (prev: unknown) => {
        const categories = prev as User[];
        return [data, ...categories];
      });

      handleCancelClick();
      toast({
        title: "Deleted successfully",
        // description: response.message,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function handleDeleteClick() {
    mutate({ token, id: user?.id ?? "" });
  }

  function handleCancelClick() {
    setMode({ mode: "view" });
  }
  return (
    <AlertDialogFooter>
      <Button
        variant={"destructive"}
        disabled={isLoading}
        onClick={handleDeleteClick}
      >
        {isLoading && (
          <Icons.spinner
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}
        Continue
      </Button>

      <AlertDialogCancel disabled={isLoading} onClick={handleCancelClick}>
        Cancel
      </AlertDialogCancel>
    </AlertDialogFooter>
  );
}
