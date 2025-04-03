import { ColumnDef } from "@tanstack/react-table";
export const studentColumns: ColumnDef<any>[] = [
  {
    accessorKey: "lecture",
    header: "Taken",
    cell: ({ row }) => <div>{row.getValue("lecture")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "klas",
    header: "Klas",
    cell: ({ row }) => <div>{row.getValue("klas")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div>{row.getValue("type")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => <div>{row.getValue("deadline")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => <div>{row.getValue("score")}</div>,
    enableSorting: true,
  },
  {
    accessorKey: "feedback",
    header: "Feedback",
    cell: ({ row }) => <div>{row.getValue("feedback")}</div>,
    enableSorting: true,
  },
];
