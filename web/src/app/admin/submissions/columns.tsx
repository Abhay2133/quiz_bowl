"use client";

import { ArrowUpDown } from "lucide-react";
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
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { formatISODate } from "@/util/datetime";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Submission = {
  id: number;
  userName: string;
  quizcode: string;
  quizName: string;
  userEmail: string;
  teamName: string;
  score: number;
  answers: any;
  submittedAt: string;
  // methods
  delete: any;
  edit: any;
};

export const columns: ColumnDef<Submission>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "userName",
    header: "User",
  },
  {
    accessorKey: "quizcode",
    header: "Quiz Code",
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "quizName",
    header: "Quiz",
  },
  {
    accessorKey: "userEmail",
    header: "Email",
  },
  {
    accessorKey: "teamName",
    header: "Teaam",
  },
  {
    accessorKey: "submittedAt",
    accessorFn: (orginalRow: Submission) =>
      formatISODate(orginalRow.submittedAt),
    header: "Timing",
  },
  {
    header: "actions",
    id: "actions",
    cell: ({ row }) => {
      const quiz = row.original;
      // console.log(quiz);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              {/* <span className="sr-only">Open menu</span> */}
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={quiz.delete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  // {
  //   accessorKey: "startTiming",
  //   header: "Start Timing",
  // },
  // {
  //   accessorKey: "date",
  //   header: "Date",
  // },
  // {
  //   accessorKey: "createdAt",
  //   header: "Created At",
  // },
  // {
  //   accessorKey: "updatedAt",
  //   header: "Updated At",
  // },
];
