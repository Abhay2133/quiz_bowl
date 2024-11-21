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
import { ReactNode } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Team = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  actionUI: ReactNode;
};

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
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
      const team = row.original;
      return team.actionUI;
    },
  },
];
