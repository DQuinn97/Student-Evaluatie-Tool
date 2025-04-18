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
import Cookies from "js-cookie";

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
  // useEffect(() => {}, [hasAccess]);

  const onSubmit = async function () {
    setHasAccess(true);
    setIsLoading(true);
    try {
      await document
        .requestStorageAccess()
        .then(
          async () => {
            console.log("storage access granted");
            await api
              .post("/auth/login", {
                email: form.getValues("email"),
                wachtwoord: form.getValues("wachtwoord"),
              })
              .then(async (response) => {
                console.log("response: ", response);
                console.log(Cookies.get());
                console.log(response.headers);
                if (!document.cookie.includes("tokenExists")) {
                  await api
                    .get("/auth/test")
                    .then((response) => {
                      console.log(true, response);
                      toast.success(response.data.message);
                      setHasAccess(true);
                    })
                    .catch(() => {
                      setHasAccess(false);

                      toast.error(
                        "Deze app heeft cookies nodig om te kunnen werken. Geef toestemming om cookies te gebruiken in je browsersettings.",
                      );
                    });
                } else {
                  console.log(true, document.cookie);
                  toast.success(response.data.message);
                  setHasAccess(true);
                }
              })
              .catch((error) => {
                setHasAccess(false);
                throw error;
              });
          },
          () => {
            console.log("storage access not granted", document.cookie);
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

      if (hasAccess) {
        setTimeout(() => {
          navigate("/student/dashboard");
        }, 1500);
      }
    } catch (error) {
      setHasAccess(false);
      toast.error((error as { message: string }).message ?? "Onbekende fout");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-2xl font-bold">Login</div>
      {!hasAccess && (
        <div className="text-muted-foreground text-center text-sm">
          De app heeft cookies nodig om te kunnen werken.
          <br />
          Geef toestemming om cookies te gebruiken in je browsersettings.
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
