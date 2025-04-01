import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email().min(1, "Please enter a valid email address"),
  password: z.string(),
});

const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit() {
    try {
      toast.success(`Login successful, you will be redirected soon.`);
    } catch (error) {
      toast.error((error as Error).message);
    }
  }
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-2xl font-bold">Login</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                {/* <FormDescription>
                  An email will be send for confirmation
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
          <div className="text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500">
              Register
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default Login;
