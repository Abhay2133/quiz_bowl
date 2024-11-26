"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { convertToISODateTime, formatISODate } from "@/util/datetime"
import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import Link from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export interface LiveQuiz {
  id: number;
  name:string;
  quizcode: string;
  quizData: any; // Change `any` to a more specific type for quizData if needed
  activeRoundIndex: number;
  activeQuestionIndex: number;
  isAnswerAllowed: boolean;
  status: 'NOT_STARTED' | 'ACTIVE' | 'FINISHED';
  timeLimit: number;
  // liveAnswers: any[]; // Array of LiveAnswer objects, could be further typed if needed
  positiveScore: number;
  negativeScore: number;
  createdAt: string;
  updatedAt: string;

  onOpen:any;
  edit:any;
  delete:any;
}

export const columns: ColumnDef<LiveQuiz>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
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
    header:"OPEN",
    cell:({row}) =>{
      const liveQuiz = row.original;
      return (<Button onClick={()=>liveQuiz.onOpen()}>Open</Button>)
    }
  },
  {
    header: "actions",
    id: "actions",
    cell: ({ row }) => {
      const liveQuiz = row.original

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
            
            <DropdownMenuItem onClick={liveQuiz.edit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={liveQuiz.delete}>Delete</DropdownMenuItem>
            {/* <DropdownMenuItem>
              <Link href={`/admin/quizs/${team.quizId}/teams/${team.id}/members`}>
                Members
              </Link>
            </DropdownMenuItem> */}
            {/* <DropdownMenuSeparator /> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
