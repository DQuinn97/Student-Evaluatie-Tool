import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api from "../api";
import { useIsMobile } from "@/hooks/use-mobile";

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
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const formSchema = z.object({
  email: z.string().email().min(1, "Please enter a valid email address"),
  naam: z.string().optional(),
  achternaam: z.string().optional(),
});

const Register = () => {
  const isMobile = useIsMobile();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      naam: "",
      achternaam: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async function () {
    setIsLoading(true);
    try {
      await api.post<{ token: string }>("/auth/register", form.getValues(), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success(
        "Registratie successvol, bekijk je email voor verdere instructies.",
      );
    } catch (error) {
      if (
        (error as { response?: { status?: number } }).response?.status === 400
      ) {
        toast.error(
          "Gebruiker met deze email bestaat al, probeer het opnieuw.",
        );
      } else {
        toast.error((error as Error).message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">
            Registreren
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div
                className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-x-6 gap-y-2`}
              >
                <FormField
                  control={form.control}
                  name="naam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Voornaam</FormLabel>
                      <FormControl>
                        <Input placeholder="Voornaam" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="achternaam"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Achternaam</FormLabel>
                      <FormControl>
                        <Input placeholder="Achternaam" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className={`${isMobile ? "" : "col-span-2"}`}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Email" {...field} />
                        </FormControl>
                        <FormDescription>
                          Je zult een email krijgen met verdere instructies.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                disabled={isLoading}
                className="mt-6 w-full"
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Bezig met registreren
                  </>
                ) : (
                  "Registreren"
                )}
              </Button>

              <div className="text-muted-foreground pt-2 text-center text-sm">
                Heb je al een account?{" "}
                <Link to="/login" className="text-blue-500 hover:text-blue-700">
                  Login
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
export default Register;
