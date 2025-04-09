import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import api from "@/api";
import { useNavigate, useParams } from "react-router";

// Form types
type ResetRequestForm = {
  email: string;
};

type ResetPasswordForm = {
  password: string;
  password2: string;
};

// Validation schemas
const resetRequestSchema = z.object({
  email: z.string().email("Voer een geldig emailadres in"),
});

const passwordSchema = z
  .object({
    password: z
      .string({
        required_error: "Wachtwoord mag niet leeg zijn.",
      })
      .regex(/^.{8,20}$/, {
        message: "Minimaal 8 en maximaal 20 karakters.",
      })
      .regex(/(?=.*[A-Z])/, {
        message: "Ten minste één hoofdletter.",
      })
      .regex(/(?=.*[a-z])/, {
        message: "Ten minste één kleine letter.",
      })
      .regex(/(?=.*\d)/, {
        message: "Ten minste één cijfer.",
      })
      .regex(/[$&+,:;=?@#|'<>.^*()%!-]/, {
        message: "Ten minste één speciaal teken.",
      }),
    password2: z.string({
      required_error: "Wachtwoord bevestiging mag niet leeg zijn.",
    }),
  })
  .refine(({ password, password2 }) => password === password2, {
    path: ["password2"],
    message: "Wachtwoorden moeten overeenkomen.",
  });

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const resetRequestForm = useForm<ResetRequestForm>({
    resolver: zodResolver(resetRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetPasswordForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      password2: "",
    },
  });

  async function onResetRequest(data: ResetRequestForm) {
    setIsLoading(true);
    try {
      await api.post("/auth/reset/request", {
        email: data.email,
        reset_link: `${window.location.origin}/reset-password`,
      });
      toast.success(
        "Als dit emailadres bij ons bekend is, ontvang je een email met verdere instructies.",
      );
    } catch (error) {
      toast.error("Er is iets misgegaan bij het versturen van de reset link.");
    } finally {
      setIsLoading(false);
    }
  }

  async function onPasswordReset(data: ResetPasswordForm) {
    setIsLoading(true);
    try {
      await api.post("/auth/reset", {
        wachtwoord: data.password,
        resetToken: token,
      });
      toast.success("Wachtwoord succesvol gereset, je wordt nu doorgestuurd.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error("Er is iets misgegaan bij het resetten van je wachtwoord.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="mb-4 text-2xl font-bold">
        {token ? "Nieuw wachtwoord instellen" : "Wachtwoord vergeten"}
      </div>
      {token ? (
        <Form {...resetPasswordForm}>
          <form
            onSubmit={resetPasswordForm.handleSubmit(onPasswordReset)}
            className="space-y-8"
          >
            <FormField
              control={resetPasswordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nieuw wachtwoord</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Nieuw wachtwoord"
                        type={showPassword ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute top-2.5 right-3"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={resetPasswordForm.control}
              name="password2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bevestig wachtwoord</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Bevestig wachtwoord"
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                      />
                      <button
                        type="button"
                        className="absolute top-2.5 right-3"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Bezig...
                </>
              ) : (
                "Wachtwoord resetten"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...resetRequestForm}>
          <form
            onSubmit={resetRequestForm.handleSubmit(onResetRequest)}
            className="space-y-8"
          >
            <FormField
              control={resetRequestForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="naam@voorbeeld.be"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Bezig...
                </>
              ) : (
                "Reset link versturen"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ResetPassword;
