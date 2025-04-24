import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ProfileData } from "../../types";

type ProfileFormProps = {
  formData: ProfileData;
  setFormData: React.Dispatch<React.SetStateAction<ProfileData>>;
  onSubmit: (event: React.FormEvent) => void;
  loading: boolean;
};

export const ProfileForm = ({
  formData,
  setFormData,
  onSubmit,
  loading,
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2">
      <Label className="mt-2">Voornaam</Label>
      <Input
        type="text"
        placeholder="John"
        value={formData.naam}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, naam: e.target.value }))
        }
        disabled={loading}
      />
      <Label className="mt-2">Naam</Label>
      <Input
        type="text"
        placeholder="Doe"
        value={formData.achternaam}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, achternaam: e.target.value }))
        }
        disabled={loading}
      />
      <Label className="mt-2">GSM</Label>
      <Input
        type="tel"
        placeholder="04xxxxxx"
        value={formData.gsm}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, gsm: e.target.value }))
        }
        disabled={loading}
      />
      <Button type="submit" className="mt-4" disabled={loading}>
        {loading ? "Bezig met opslaan..." : "Opslaan"}
      </Button>
    </form>
  );
};
