import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Link } from "react-router";
import { Separator } from "./ui/separator";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ProfileData } from "../types";
import api from "../api";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

const Profile = () => {
  const [formData, setFormData] = useState<ProfileData>({
    id: "",
    naam: "",
    achternaam: "",
    gsm: "",
    foto: "https://placehold.co/250x250",
    email: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showId, setShowId] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.naam || !formData.achternaam || !formData.gsm) {
      toast.error("Alles moet worden ingevuld!");
      return;
    }

    if (!/^\d{10}$/.test(formData.gsm)) {
      toast.error("Geen geldig telefoonnummer");
      return;
    }

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
      }

      toast.success(
        "Profiel succesvol geüpdated! Je foto wordt zo bijgewerkt...",
      );
      // Refresh profile data to get the updated image URL from server
      await fetchProfile();

      // Force reload the parent component to update the header
      setTimeout(() => {
        navigate(0);
      }, 1500);
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Bestand is te groot. Maximum grootte is 5MB");
      return;
    }

    setSelectedFile(file);
    // Create a preview URL for the selected image
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, foto: previewUrl }));
  };

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (formData.foto && formData.foto.startsWith("blob:")) {
        URL.revokeObjectURL(formData.foto);
      }
    };
  }, [formData.foto]);

  return (
    <div className="grid place-items-center">
      <h1 className="mb-4 text-2xl font-bold">Profiel</h1>

      <div className="flex flex-row gap-10">
        <div className="flex flex-col items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <img
                src={formData.foto}
                alt="Profiel foto"
                className="h-32 w-32 cursor-pointer rounded-full object-cover transition-opacity hover:opacity-90"
                title="Klik om te vergroten"
              />
            </DialogTrigger>
            <DialogContent className="flex items-center justify-center p-1 sm:max-w-md">
              <DialogTitle className="sr-only">Profiel foto</DialogTitle>
              <img
                src={formData.foto}
                alt="Profiel foto"
                className="max-h-[70vh] max-w-full rounded-md object-contain"
                style={{ objectFit: "contain" }}
              />
              <DialogDescription className="sr-only">
                Klik buiten deze afbeelding om te sluiten
              </DialogDescription>
            </DialogContent>
          </Dialog>
          <Button
            onClick={() => document.getElementById("image")?.click()}
            className="mt-2"
          >
            Verander
          </Button>
          <input
            type="file"
            accept="image/jpeg, image/png"
            hidden
            id="image"
            onChange={handleImageChange}
          />
          <p className="text-muted-foreground mt-2 text-sm">{formData.email}</p>
          <p
            className="text-muted-foreground mt-2 cursor-pointer text-xs"
            onClick={() => setShowId(!showId)}
          >
            ID: {showId ? formData.id : "********** (click to reveal)"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Label className="mt-2">Voornaam</Label>
          <Input
            type="text"
            placeholder="John"
            value={formData.naam}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, naam: e.target.value }))
            }
          />
          <Label className="mt-2">Naam</Label>
          <Input
            type="text"
            placeholder="Doe"
            value={formData.achternaam}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, achternaam: e.target.value }))
            }
          />
          <Label className="mt-2">GSM</Label>
          <Input
            type="tel"
            placeholder="04xxxxxx"
            value={formData.gsm}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, gsm: e.target.value }))
            }
          />
          <Button type="submit" className="mt-4">
            Opslaan
          </Button>
        </form>
      </div>

      <Separator className="bg-accent m-10" />
      <Button>
        <Link to="/reset-password">Verander Wachtwoord</Link>
      </Button>
    </div>
  );
};

export default Profile;
