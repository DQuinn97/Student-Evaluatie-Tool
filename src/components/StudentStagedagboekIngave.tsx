import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  CalendarIcon,
  Trash2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "react-router";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const FormSchema = z.object({
  date: z.date({
    required_error: "Een datum is verplicht.",
  }),
  voormiddag: z.string().min(1, "Voormiddag taken zijn verplicht."),
  namiddag: z.string().min(1, "Namiddag taken zijn verplicht."),
  tools: z.string().min(1, "Gebruikte tools zijn verplicht."),
  result: z.string().min(1, "Resultaat is verplicht."),
});

const StudentStagedagboekIngave = () => {
  const { id } = useParams();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
      voormiddag: "",
      namiddag: "",
      tools: "",
      result: "",
    },
  });
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (id) {
      // Hier zou je normaal de data ophalen van de API
      const entries = [
        {
          id: "1",
          date: "2024-01-20",
          voormiddag: "random",
          namiddag: "random2",
          tools: "random",
          result: "random",
        },
        {
          id: "2",
          date: "2024-01-21",
          voormiddag: "dssqdfghjklhgfdsqdfghjkljhgfdsfghjkldsfghjkllgfds  fgh",
          namiddag:
            "randlkqsjdhfglsmqjfhglmqsdjghlfdsjghdlsljglkdfjglsdjfglsdjfdsfggom2",
          tools: "random",
          result: "random",
        },
        {
          id: "3",
          date: "2024-01-22",
          voormiddag: "randqdsffom",
          namiddag: "qdssdfg",
          tools: "random",
          result: "random",
        },
      ];
      const mockData = entries.find((entry) => entry.id === id) || {
        date: "2024-01-20",
        voormiddag: "Test voormiddag",
        namiddag: "Test namiddag",
        tools: "Test tools",
        result: "Test result",
      };

      form.reset({
        date: new Date(mockData.date),
        voormiddag: mockData.voormiddag,
        namiddag: mockData.namiddag,
        tools: mockData.tools,
        result: mockData.result,
      });
      setDate(new Date(mockData.date));
    }
  }, [id, form]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    try {
      if (id) {
        // Update bestaande ingave
        console.log("Updating entry:", { id, ...data });
        toast.success(`Stagedagboek ingave bijgewerkt.`);
      } else {
        // Nieuwe ingave
        console.log("Creating new entry:", data);
        toast.success(`Nieuwe stagedagboek ingave toegevoegd.`);
      }
    } catch (error) {
      toast.error((error as Error).message);
    }
  };

  // Define the table columns correctly using tanstack v8
  const columns: ColumnDef<File>[] = [
    {
      accessorKey: "name",
      header: "Filename",
      cell: ({ row }) => row.original.name.replace(/\.[^.]+$/, ""),
      enableSorting: true,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => row.original.type.split("/")[1],
      enableSorting: true,
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => {
        const size = row.original.size;
        return size > 1024 * 1024 * 1024
          ? `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
          : size > 1024 * 1024
            ? `${(size / (1024 * 1024)).toFixed(2)} MB`
            : size > 1024
              ? `${(size / 1024).toFixed(2)} KB`
              : `${size} bytes`;
      },
      enableSorting: true,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          type="button"
          className="text-destructive-foreground"
          onClick={() =>
            setFiles((prev) => prev.filter((f) => f !== row.original))
          }
        >
          <Trash2 className="size-4 text-white" />
        </Button>
      ),
    },
  ];

  // Set up the table
  const table = useReactTable({
    data: files,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <Breadcrumb className="m-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/student/stagedagboek">
              Stagedagboek
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              {id ? "Bewerk ingave" : "Nieuwe ingave"}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-12">
        <h1 className="mb-4 text-4xl font-bold">
          {id ? "Bewerk stagedag ingave" : "Nieuwe stagedag ingave"}
        </h1>
        <h2 className="mb-2 text-2xl font-semibold">Details</h2>
        <div className="m-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <>
                    <FormItem>
                      <FormLabel className="mt-4 font-semibold">
                        Datum
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-40",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {date ? (
                                format(date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) =>
                              date <
                              new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                    <FormField
                      control={form.control}
                      name="voormiddag"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mt-4 font-semibold">
                            Uitgevoerde werkzaamheden voormiddag
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Geef een korte opsomming van je taken."
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="namiddag"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mt-4 font-semibold">
                            Uitgevoerde werkzaamheden namiddag
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Geef een korte opsomming van je taken."
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tools"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mt-4 font-semibold">
                            Gebruikte software/tools
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Vermeld de tools waarmee je aan de slag ging."
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="result"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="mt-4 font-semibold">
                            Resultaat
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Formuleer bondig een eindconclusie per dag. Was je tevreden? Minder tevreden? Reacties stagementor?"
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormItem>
                      <FormLabel className="mt-4 font-semibold">
                        Bijlagen
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          onChange={(e) => {
                            setFiles([
                              ...files,
                              ...Array.from(e.target.files ?? []),
                            ]);
                          }}
                        />
                      </FormControl>
                      <FormControl>
                        {files.length > 0 && (
                          <Table>
                            <TableHeader>
                              {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                  {headerGroup.headers.map((header) => (
                                    <TableHead
                                      key={header.id}
                                      className={cn(
                                        header.column.getCanSort() &&
                                          "cursor-pointer",
                                      )}
                                      onClick={header.column.getToggleSortingHandler()}
                                    >
                                      {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                          )}
                                      {header.column.getIsSorted() ? (
                                        header.column.getIsSorted() ===
                                        "asc" ? (
                                          <ArrowUpNarrowWide className="ml-1 h-4 w-4" />
                                        ) : (
                                          <ArrowDownWideNarrow className="ml-1 h-4 w-4" />
                                        )
                                      ) : null}
                                    </TableHead>
                                  ))}
                                </TableRow>
                              ))}
                            </TableHeader>
                            <TableBody>
                              {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                  {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                      {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                      )}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </FormControl>
                    </FormItem>
                  </>
                )}
              />
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
