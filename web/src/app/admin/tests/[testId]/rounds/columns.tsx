"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Round = {
  id: number,
  testId: number,
  name: string,
  order: number,
  duration: number,
  startTiming: string,
  createdAt: string,
  updatedAt: string,
  easyQ: number,
  mediumQ: number,
  hardQ: number
}

export const columns: ColumnDef<Round>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  // {
  //   accessorKey: "testId",
  //   header: "Test ID",
  // },
  // {
  //   accessorKey: "order",
  //   header: "Order",
  // },
  {
    accessorKey: "duration",
    header: "Duration (min)",
  },
  {
    accessorKey: "startTiming",
    header: "Start Time",
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
    accessorKey: "easyQ",
    header: "Easy Questions",
  },
  {
    accessorKey: "mediumQ",
    header: "Medium Questions",
  },
  {
    accessorKey: "hardQ",
    header: "Hard Questions",
  },
  {
    header: "actions",
    id: "actions",
    cell: ({ row }) => {
      const round = row.original

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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={`/admin/tests/${round.testId}/rounds/${round.id}/questions`}>
                Questions
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
