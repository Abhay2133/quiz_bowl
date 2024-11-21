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
import { formatISODate } from "@/util/datetime";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Team = {
  id: number;
  name: string;
  // quizId: number,
  createdAt: string;
  updatedAt: string;
  edit: any;
  delete: any;
};

export const columns: ColumnDef<Team>[] = [
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
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    accessorFn:(ogRow, index)=>formatISODate(ogRow.createdAt),
    header: "Created At",
  },
  {
    accessorKey: "updatedAt",
    accessorFn:(ogRow, index)=>formatISODate(ogRow.updatedAt),
    header: "Updated At",
  },
  {
    header: "actions",
    id: "actions",
    cell: ({ row }) => {
      const team = row.original;

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
            {/* <DropdownMenuItem>Edit</DropdownMenuItem> */}

            <DropdownMenuItem>
              <Link href={"/admin/teams/" + team.id + "/members"}>Members</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => team.delete()}>
              Delete
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
