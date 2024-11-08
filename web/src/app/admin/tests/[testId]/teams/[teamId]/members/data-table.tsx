"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import React from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      // sorting,
      columnFilters,
    }
  })
  const [filter, setFilter] = useState("name");
  const filterList: string[] = ["id", "name"]

  return (
    <div className="flex flex-col min-w-full px-3 md:min-w-[80%]">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Search Tests..."
          value={(table.getColumn(filter)?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            console.log(table.getColumn(filter))
            table.getColumn(filter)?.setFilterValue(event.target.value)
          }
          }
          className="flex-1"
        />
        <Select onValueChange={(value) => setFilter(value)} defaultValue={"name"}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="filter" />
          </SelectTrigger>
          <SelectContent>
            {filterList.map((item: string, i: number) => <SelectItem value={item} key={i}>{item}</SelectItem>)}
          </SelectContent>
        </Select>

        <Button className=""><PlusIcon/></Button>
      </div>
      <div className="">
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="pr-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}
