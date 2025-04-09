import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Link } from "react-router";
import { Separator } from "./ui/separator";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ProfileData } from "../types";
import api from "../api";

const Profile = () => {
  const [formData, setFormData] = useState<ProfileData>({
    naam: "",
    achternaam: "",
    gsm: "",
    foto: "https://placehold.co/250x250",
    email: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/profiel");
      setFormData({
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
      await api.post("/profiel/data", {
        naam: formData.naam,
        achternaam: formData.achternaam,
        gsm: formData.gsm,
      });

      // Only upload new image if it's a base64 string
      if (formData.foto.startsWith("data:")) {
        const imageFormData = new FormData();
        const base64Response = await fetch(formData.foto);
        const blob = await base64Response.blob();
        imageFormData.append("foto", blob, "profile.jpg");

        await api.post("/profiel/foto", imageFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      toast.success("Profiel succesvol geüpdate");
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

    const reader = new FileReader();
    reader.onload = () => {
      const imageData = reader.result as string;
      setFormData((prev) => ({ ...prev, foto: imageData }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid place-items-center">
      <h1 className="mb-4 text-2xl font-bold">Profiel</h1>

      <div className="flex flex-row gap-10">
        <div className="flex flex-col items-center gap-2">
          <img
            src={formData.foto}
            alt="Profiel foto"
            className="h-32 w-32 rounded-full object-cover"
          />
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
