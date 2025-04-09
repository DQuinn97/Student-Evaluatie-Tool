import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export const FormSchema = z.object({
  date: z.date({
    required_error: "Een datum is verplicht.",
  }),
  voormiddag: z.string().min(1, "Voormiddag taken zijn verplicht."),
  namiddag: z.string().min(1, "Namiddag taken zijn verplicht."),
  tools: z.string().min(1, "Gebruikte tools zijn verplicht."),
  result: z.string().min(1, "Resultaat is verplicht."),
});

type FormFieldsProps = {
  form: UseFormReturn<z.infer<typeof FormSchema>>;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
};

export const FormFields = ({ form, date, setDate }: FormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <>
            <FormItem>
              <FormLabel className="mt-4 font-semibold">Datum</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-40",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date < new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name="voormiddag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-4 font-semibold">
                    Uitgevoerde werkzaamheden voormiddag
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Geef een korte opsomming van je taken."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="namiddag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-4 font-semibold">
                    Uitgevoerde werkzaamheden namiddag
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Geef een korte opsomming van je taken."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tools"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-4 font-semibold">
                    Gebruikte software/tools
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Vermeld de tools waarmee je aan de slag ging."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="result"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mt-4 font-semibold">
                    Resultaat
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Formuleer bondig een eindconclusie per dag. Was je tevreden? Minder tevreden? Reacties stagementor?"
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      />
    </>
  );
};
