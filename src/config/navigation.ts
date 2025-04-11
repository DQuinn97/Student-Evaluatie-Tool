import { NavItem } from "@/types";

const studentNavigation: NavItem[] = [
  {
    label: "Dashboard",
    path: "/student/dashboard",
  },
  {
    label: "Stagedagboek",
    path: "/student/stagedagboek",
    children: [
      {
        label: "Overzicht",
        path: "/student/stagedagboek",
      },
      {
        label: "Nieuwe Ingave",
        path: "/student/stagedagboek/ingave",
      },
    ],
  },
];

const docentNavigation: NavItem[] = [
  {
    label: "Dashboard",
    path: "/docent/dashboard",
  },
  {
    label: "Klasbeheer",
    path: "/docent/klasbeheer",
  },
];

export const pathLabels: Record<string, string> = {
  dashboard: "Dashboard",
  stagedagboek: "Stagedagboek",
  ingave: "Nieuwe Ingave",
  profile: "Profiel",
  klasbeheer: "Klasbeheer",
};

export { studentNavigation, docentNavigation };
