import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Link } from "react-router";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { toast } from "sonner";

const Profile = () => {
  const [name, setName] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [tel, setTel] = useState<string>("");
  const [image, setImage] = useState<string | null>(
    "https://placehold.co/250x250",
  );

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // checkt of alle velden zijn ingevuld
    if (!name || !firstname || !tel || !image) {
      toast.error("Alles moet worden ingevuld!");
      return;
    }
    // checkt of het een geldig telefoonnummer is
    if (!/^\d{10}$/.test(tel)) {
      toast.error("Geen geldig telefoonnummer");
      return;
    }
    toast.success("Profiel geüpdate");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string | null);
        toast.success("Profielfoto succesvol geüpload");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    const input = document.querySelector<HTMLInputElement>("#image");
    if (input) {
      input.click();
    }
  };

  return (
    <div className="grid place-items-center">
      <h1 className="mb-4 text-2xl font-bold">Profiel</h1>
      <div className="flex flex-row gap-10">
        <div className="flex flex-col items-center gap-2">
          <img
            src={image || "https://placehold.co/250x250"}
            alt=""
            className="h-32 w-32 rounded-full object-cover"
          />
          <Button onClick={handleClick} className="mt-2">
            Verander
          </Button>
          <input
            type="file"
            accept="image/jpeg, image/png"
            hidden
            id="image"
            onChange={handleImageChange}
          />
          <p className="text-muted-foreground mt-2 text-sm">
            example@example.com
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Label className="mt-2">Naam</Label>
          <Input
            type="text"
            placeholder="Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Label className="mt-2">Voornaam</Label>
          <Input
            type="text"
            placeholder="John"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
          />
          <Label className="mt-2">GSM</Label>
          <Input
            type="tel"
            placeholder="04xxxxxx"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
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
