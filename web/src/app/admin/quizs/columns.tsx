"use client";

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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Test = {
  id: number;
  name: string;
  quizcode: string;
  duration: number;
  startTiming: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  positiveScore: number;
  negativeScore: number;
  delete: any;
  edit: any;
};

export const columns: ColumnDef<Test>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "quizcode",
    header: "Quiz Code",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "positiveScore",
    header: "+ve Score",
  },
  {
    accessorKey: "negativeScore",
    header: "-ve Score",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "startTiming",
    header: "Start Time",
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
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <DropdownMenuItem onClick={quiz.edit}>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={"/admin/quizs/" + quiz.id + "/rounds"}
                className="w-full"
              >
                Rounds
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                href={"/admin/quizs/" + quiz.id + "/teams"}
                className="w-full"
              >
                Teams
              </Link>
            </DropdownMenuItem>
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
