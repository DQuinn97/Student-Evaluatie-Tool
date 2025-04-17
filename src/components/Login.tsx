import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api from "../api";

import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email().min(1, "Please enter a valid email address"),
  wachtwoord: z.string(),
});

const Login = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      wachtwoord: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(true);

  const onSubmit = async function () {
    setIsLoading(true);
    try {
      let hasStorageAccess = await document.hasStorageAccess();
      console.log(hasStorageAccess);
      if (!hasStorageAccess) {
        setHasAccess(false);
        await document.requestStorageAccess().then(
          () => {
            setHasAccess(true);
          },
          () => {
            setHasAccess(false);
          },
        );
      }
      if (hasAccess) {
        const response = await api.post("/auth/login", {
          email: form.getValues("email"),
          wachtwoord: form.getValues("wachtwoord"),
        });

        const data = response.data;

        if (response.status === 200) {
          toast.success(data.message);
          setTimeout(() => {
            navigate("/student/dashboard");
          }, 1500);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error((error as { message: string }).message ?? "Onbekende fout");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-2xl font-bold">Login</div>
      {!hasAccess && (
        <div>
          Deze app heeft toegang nodig tot cookies om te kunnen werken, geef
          deze toegang om verder te gaan.
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="m-4 space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="wachtwoord"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wachtwoord</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Wachtwoord"
                    type="password"
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} className="w-full" aria-busy={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Checking
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
        <div className="text-muted-foreground text-sm">
          Heb je nog geen account?{" "}
          <Link to="/register" className="text-blue-500">
            Registreren
          </Link>
        </div>
        <div className="text-muted-foreground text-sm">
          Wachtwoord vergeten?{" "}
          <Link to="/reset-password" className="text-blue-500">
            Reset
          </Link>
        </div>
      </Form>
    </div>
  );
};
export default Login;
