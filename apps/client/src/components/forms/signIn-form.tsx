import { Icons } from "@/components/icons";
import { PasswordInput } from "@/components/password-input";
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
import { QUERY_ACTIVE_USER_KEY } from "@/constant/query.constant";
import api from "@/lib/api";
import { useBoundStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorOption, useForm } from "react-hook-form";
import { AuthInput, User, activeUserSchema, authBody } from "schema";

export function SignInForm() {
  const queryClient = useQueryClient();
  const { setAuthUser } = useBoundStore((state) => state.auth);
  const form = useForm<AuthInput>({
    resolver: zodResolver(authBody),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: (data: AuthInput) => {
      return api.post<User>("/sessions", JSON.stringify(data));
    },
    onSuccess: (response) => {
      const user = activeUserSchema.parse(response.data);
      setAuthUser(user);
      queryClient.setQueryData([QUERY_ACTIVE_USER_KEY], user);
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as ErrorOption;

      form.setError("email", data, { shouldFocus: true });
      form.setError("password", { message: "" });
    },
  });

  async function onSubmit(data: AuthInput) {
    mutate(data);
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="email"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isLoading}>
          {isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Sign in
          <span className="sr-only">Sign in</span>
        </Button>
      </form>
    </Form>
  );
}
