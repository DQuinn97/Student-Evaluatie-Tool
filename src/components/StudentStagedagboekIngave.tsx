import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { FormSchema, FormFields } from "./stagedagboek/FormFields";
import { FileUpload } from "./stagedagboek/FileUpload";
import api from "../api";

const StudentStagedagboekIngave = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [files, setFiles] = useState<File[]>([]);
  const [dagboekId, setDagboekId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(), // Expliciete instelling op huidige datum (now)
      voormiddag: "",
      namiddag: "",
      tools: "",
      result: "",
    },
  });

  useEffect(() => {
    const fetchDagboekAndEntry = async () => {
      try {
        // Get user's class
        const { data: classes } = await api.get("/klassen");
        if (!classes || classes.length === 0) {
          toast.error("Je bent nog niet toegevoegd aan een klas");
          navigate("/student/dashboard");
          return;
        }

        // Get or create dagboek
        let { data: dagboek } = await api.get(
          `/klassen/${classes[0]._id}/dagboek`,
        );
        if (!dagboek) {
          const response = await api.post(`/klassen/${classes[0]._id}/dagboek`);
          dagboek = response.data;
        }

        setDagboekId(dagboek._id);

        // If editing, verify the entry belongs to this dagboek
        if (id) {
          setIsEditMode(true);
          const isValidEntry = dagboek.stagedagen?.some(
            (dag: any) => dag._id === id,
          );
          if (!isValidEntry) {
            toast.error(
              "Deze ingave bestaat niet of je hebt er geen toegang toe",
            );
            navigate("/student/stagedagboek");
            return;
          }

          const { data } = await api.get(`/dagboek/dag/${id}`);
          form.reset({
            date: new Date(data.datum),
            voormiddag: data.voormiddag,
            namiddag: data.namiddag,
            tools: data.tools,
            result: data.resultaat,
          });
          setDate(new Date(data.datum));
        }
      } catch (error) {
        toast.error("Failed to load data");
        console.error(error);
      }
    };

    fetchDagboekAndEntry();
  }, [id, form, navigate]);

  // Custom date setter that only updates the date in create mode
  const handleDateChange = (newDate: Date | undefined) => {
    if (!isEditMode && newDate) {
      setDate(newDate);
      form.setValue("date", newDate);
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      if (!dagboekId) {
        toast.error("Geen dagboek gevonden");
        return;
      }

      const endpoint = id ? `/dagboek/dag/${id}` : `/dagboek/${dagboekId}/dag`;
      const method = id ? "patch" : "post";

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

        await api({
          method,
          url: endpoint,
          data: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // If no files, send JSON directly
        await api({
          method,
          url: endpoint,
          data: {
            datum: data.date.toISOString(),
            voormiddag: data.voormiddag || "",
            namiddag: data.namiddag || "",
            tools: data.tools || "",
            resultaat: data.result || "",
          },
        });
      }

      toast.success(
        id
          ? "Stagedagboek ingave bijgewerkt."
          : "Nieuwe stagedagboek ingave toegevoegd.",
      );
      navigate("/student/stagedagboek");
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
              <FormFields
                form={form}
                date={date}
                setDate={handleDateChange}
                isEditMode={isEditMode}
              />
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
