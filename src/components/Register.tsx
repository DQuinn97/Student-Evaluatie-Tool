import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import api from "../api";

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

const formSchema = z.object({
  email: z.string().email().min(1, "Please enter a valid email address"),
});

const Register = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
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
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="text-2xl font-bold">Registreren</div>
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
                <FormDescription>
                  Je zult een email krijgen met verdere instructies.
                </FormDescription>
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
              "Registreren"
            )}
          </Button>
          <div className="text-muted-foreground text-sm">
            Heb je al een account?{" "}
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default Register;
