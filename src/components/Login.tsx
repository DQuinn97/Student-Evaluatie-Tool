import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useParams } from "react-router";
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
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import pkceChallenge from "pkce-challenge";

const formSchema = z.object({
  email: z.string().email().min(1, "Please enter a valid email address"),
  wachtwoord: z.string(),
});

const Login = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      wachtwoord: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (token) {
      (async () => {
        try {
          const verifier = localStorage.getItem("verifier");
          if (!verifier) {
            toast.error("Authenticatie mislukt...");
            setTimeout(() => {
              navigate("/login");
            }, 1500);
          }

          await api
            .post(`/auth/login?token=${token}`, { code_verifier: verifier })
            .then(async (response) => {
              localStorage.setItem("token", response.data.token);

              await api
                .get("/auth/test")
                .then(() => {
                  toast.success(response.data.message);
                  setTimeout(() => {
                    navigate("/student/dashboard");
                  }, 1500);
                })
                .catch(() => {
                  localStorage.removeItem("token");
                  toast.error("Authenticatie mislukt...");
                  setTimeout(() => {
                    navigate("/login");
                  }, 1500);
                });
            });
        } catch (error) {
          localStorage.removeItem("token");
          toast.error("Authenticatie mislukt...");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        } finally {
          localStorage.removeItem("verifier");
        }
      })();
    }
  }, [navigate]);

  const onSubmit = async function () {
    setIsLoading(true);
    try {
      const challenge = await pkceChallenge();
      localStorage.setItem("verifier", challenge.code_verifier);

      await api
        .post("/auth/authorize", {
          email: form.getValues("email"),
          wachtwoord: form.getValues("wachtwoord"),
          code_challenge: challenge.code_challenge,
          redirect_url: `/login`,
        })
        .then((response) => {
          setTimeout(() => {
            navigate(response.data.redirect);
          }, 1500);
        });
    } catch (error) {
      toast.error("Verkeerd wachtwoord of email...");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4">
      {!token ? (
        <>
          {" "}
          <Card className="w-full max-w-md shadow-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-center text-2xl font-bold">
                Login
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Email"
                            {...field}
                            className="h-10"
                          />
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
        </>
      ) : (
        <>
          <div className="items-center text-center text-2xl font-bold">
            <Loader2
              className="mr-auto ml-auto animate-spin"
              width={40}
              height={40}
            />
            <br />
            Login verifiëren...
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
