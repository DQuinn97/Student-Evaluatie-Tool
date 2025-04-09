import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { FormSchema, FormFields } from "./stagedagboek/FormFields";
import { FileUpload } from "./stagedagboek/FileUpload";

const StudentStagedagboekIngave = () => {
  const { id } = useParams();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
      voormiddag: "",
      namiddag: "",
      tools: "",
      result: "",
    },
  });

  useEffect(() => {
    const fetchDag = async () => {
      if (id) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/dagboek/dag/${id}`,
            {
              credentials: "include",
            },
          );
          if (!response.ok) throw new Error("Failed to fetch day entry");
          const data = await response.json();

          form.reset({
            date: new Date(data.datum),
            voormiddag: data.voormiddag,
            namiddag: data.namiddag,
            tools: data.tools,
            result: data.resultaat,
          });
          setDate(new Date(data.datum));
        } catch (error) {
          toast.error("Failed to load day entry");
          console.error(error);
        }
      }
    };
    fetchDag();
  }, [id, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const url = id
        ? `http://localhost:3000/api/dagboek/dag/${id}`
        : "http://localhost:3000/api/dagboek/dag/nieuw";
      const method = id ? "PATCH" : "POST";

      // If there are files, use FormData
      if (files.length > 0) {
        const formData = new FormData();
        formData.append("datum", data.date.toISOString());
        formData.append("voormiddag", data.voormiddag || "");
        formData.append("namiddag", data.namiddag || "");
        formData.append("tools", data.tools || "");
        formData.append("resultaat", data.result || "");

        files.forEach((file) => {
          formData.append("bijlagen", file);
        });

        const response = await fetch(url, {
          method,
          credentials: "include",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to save day entry");
        }
      } else {
        // If no files, send JSON directly
        const response = await fetch(url, {
          method,
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            datum: data.date.toISOString(),
            voormiddag: data.voormiddag || "",
            namiddag: data.namiddag || "",
            tools: data.tools || "",
            resultaat: data.result || "",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to save day entry");
        }
      }

      toast.success(
        id
          ? "Stagedagboek ingave bijgewerkt."
          : "Nieuwe stagedagboek ingave toegevoegd.",
      );
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-12">
        <h1 className="mb-4 text-4xl font-bold">
          {id ? "Bewerk stagedag ingave" : "Nieuwe stagedag ingave"}
        </h1>
        <h2 className="mb-2 text-2xl font-semibold">Details</h2>
        <div className="m-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormFields form={form} date={date} setDate={setDate} />
              <FileUpload files={files} setFiles={setFiles} />
              <Button type="submit" className="mt-4 w-full">
                Verzenden
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default StudentStagedagboekIngave;
