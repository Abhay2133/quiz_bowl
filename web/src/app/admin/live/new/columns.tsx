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
export type Quiz = {
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
  create: any;
};

export const columns: ColumnDef<Quiz>[] = [
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
    accessorKey: "positiveScore",
    header: "+ve Score",
  },
  {
    accessorKey: "negativeScore",
    header: "-ve Score",
  },

  {
    header: "actions",
    id: "actions",
    cell: ({ row }) => {
      const quiz = row.original;
      // console.log(quiz);
      return (
        <Button variant={'outline'} onClick={()=> quiz.create()}>Create</Button>
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
