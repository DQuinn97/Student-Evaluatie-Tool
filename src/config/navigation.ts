import { NavItem } from "@/types";

export const navigation: NavItem[] = [
  {
    label: "Dashboard",
    path: "/student/dashboard",
  },
  {
    label: "Stagedagboek",
    path: "/student/stagedagboek",
    children: [
      {
        label: "Nieuwe Ingave",
        path: "/student/stagedagboek/ingave",
      },
    ],
  },
];

export const pathLabels: Record<string, string> = {
  dashboard: "Dashboard",
  stagedagboek: "Stagedagboek",
  ingave: "Nieuwe Ingave",
  profile: "Profiel",
};
