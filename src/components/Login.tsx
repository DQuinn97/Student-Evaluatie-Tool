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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";

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
    setHasAccess(true);
    setIsLoading(true);
    try {
      await document
        .requestStorageAccess()
        .then(
          async () => {
            await api
              .post("/auth/login", {
                email: form.getValues("email"),
                wachtwoord: form.getValues("wachtwoord"),
              })
              .then(async (response) => {
                if (!document.cookie.includes("tokenExists")) {
                  await api
                    .get("/auth/test")
                    .then(() => {
                      toast.success(response.data.message);
                      setHasAccess(true);
                      setTimeout(() => {
                        navigate("/student/dashboard");
                      }, 1500);
                    })
                    .catch(() => {
                      setHasAccess(false);

                      toast.error(
                        "Deze app heeft cookies nodig om te kunnen werken. Geef toestemming om cookies te gebruiken in je browsersettings.",
                      );
                    });
                } else {
                  toast.success(response.data.message);
                  setHasAccess(true);
                  setTimeout(() => {
                    navigate("/student/dashboard");
                  }, 1500);
                }
              })
              .catch((error) => {
                setHasAccess(false);
                throw error;
              });
          },
          () => {
            setHasAccess(false);
            toast.error(
              "Deze app heeft cookies nodig om te kunnen werken. Geef toestemming om cookies te gebruiken in je browsersettings.",
            );
          },
        )
        .catch(() => {
          setHasAccess(false);

          toast.error(
            "Deze app heeft cookies nodig om te kunnen werken. Geef toestemming om cookies te gebruiken in je browsersettings.",
          );
        });
    } catch (error) {
      setHasAccess(false);
      toast.error((error as { message: string }).message ?? "Onbekende fout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            Login
          </CardTitle>
          {!hasAccess && (
            <div className="text-muted-foreground text-center text-sm">
              De app heeft cookies nodig om te kunnen werken.
              <br />
              Geef toestemming om cookies te gebruiken in je browsersettings.
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} className="h-10" />
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
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isLoading}
                className="mt-6 w-full"
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 border-t pt-4">
          <div className="text-muted-foreground text-center text-sm">
            Heb je nog geen account?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-500 hover:text-blue-700"
            >
              Registreren
            </Link>
          </div>
          <div className="text-muted-foreground text-center text-sm">
            Wachtwoord vergeten?{" "}
            <Link
              to="/reset-password"
              className="font-medium text-blue-500 hover:text-blue-700"
            >
              Reset
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
