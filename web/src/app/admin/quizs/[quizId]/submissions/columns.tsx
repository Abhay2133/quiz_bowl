"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Question = {
  id: number;
  question: string;
  answer: "OPTION1" | "OPTION2" | "OPTION3" | "OPTION4";
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  type: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";
  link: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  roundId: number;
  quizId: number;

  edit:any;
  delete:any;

  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Question>[] = [
  {
    accessorKey: "id",
    accessorFn: (row) => row?.id?.toString(),
    header: "ID",
  },
  {
    accessorKey: "question",
    // header: "Question",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Question
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const question = row.original;
      return <div className="max-w-[200px] mr-5 ">{question.question}</div>;
    },
  },
  {
    accessorKey: "option1",
    header: "Option 1",
  },
  {
    accessorKey: "option2",
    header: "Option 2",
  },
  {
    accessorKey: "option3",
    header: "Option 3",
  },
  {
    accessorKey: "option4",
    header: "Option 4",
  },
  {
    accessorKey: "answer",
    header: "Answer",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "link",
    header: "Link",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
  },
  {
    accessorKey: "roundId",
    header: "Round ID",
  },
  {
    accessorKey: "quizId",
    header: "Test ID",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
  },
  {
    header: "actions",
    id: "actions",
    cell: ({ row }) => {
      const question = row.original;
      // const base_url =
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <DropdownMenuItem onClick={()=>question.edit()}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>question.delete()}>Delete</DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
