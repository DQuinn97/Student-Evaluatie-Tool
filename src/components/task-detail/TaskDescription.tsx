interface TaskDescriptionProps {
  klas: string;
  type: string;
}

export const TaskDescription = ({ klas, type }: TaskDescriptionProps) => {
  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold">Taak beschrijving</h2>
      <p className="text-muted-foreground">
        Deze opdracht test je kennis van {klas} en moet worden ingeleverd als
        een {type}. Zorg ervoor dat je alle vereisten volgt en je werk op tijd
        inlevert.
      </p>
    </div>
  );
};
