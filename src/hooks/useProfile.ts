import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ProfileData } from "../types";
import api from "../api";
import { useNavigate } from "react-router";

export const useProfile = () => {
  const [formData, setFormData] = useState<ProfileData>({
    id: "",
    naam: "",
    achternaam: "",
    gsm: "",
    foto: "https://placehold.co/250x250",
    email: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/profiel");
      setFormData({
        id: data._id || "",
        naam: data.naam || "",
        achternaam: data.achternaam || "",
        gsm: data.gsm || "",
        foto: data.foto || "https://placehold.co/250x250",
        email: data.email || "",
      });
    } catch (error) {
      toast.error("Er ging iets mis bij het laden van je profiel");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const saveProfile = async () => {
    if (!formData.naam || !formData.achternaam || !formData.gsm) {
      toast.error("Alles moet worden ingevuld!");
      return false;
    }

    if (!/^\d{10}$/.test(formData.gsm)) {
      toast.error("Geen geldig telefoonnummer");
      return false;
    }

    setLoading(true);
    try {
      // Update profile data
      await api.post("/profiel/data", {
        id: formData.id,
        naam: formData.naam,
        achternaam: formData.achternaam,
        gsm: formData.gsm,
      });

      // Upload the image if a new one was selected
      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append("foto", selectedFile);

        await api.post("/profiel/foto", imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Give the server time to process the image before refreshing
        toast.success(
          "Profiel succesvol geüpdated! Je foto wordt zo bijgewerkt...",
        );

        // Longer delay when an image was uploaded to ensure it's processed
        setTimeout(async () => {
          await fetchProfile();
          // Force reload the parent component to update the header
          setTimeout(() => {
            navigate(0);
          }, 500);
        }, 2000);
      } else {
        // No image uploaded, proceed normally
        toast.success("Profiel succesvol geüpdated!");
        await fetchProfile();

        // Force reload the parent component to update the header
        setTimeout(() => {
          navigate(0);
        }, 1000);
      }

      return true;
    } catch (error) {
      toast.error((error as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    selectedFile,
    setSelectedFile,
    fetchProfile,
    saveProfile,
    loading,
  };
};
