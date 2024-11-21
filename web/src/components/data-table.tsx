"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  VisibilityState,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { ReactNode, useEffect, useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TrashIcon } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onCreate,
  onSelectUI,
  setSelected,
}: DataTableProps<TData, TValue> & {
  onCreate?: any;
  onSelectUI?: ReactNode | ReactNode[];
  setSelected?: any;
}) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [rowSelection, setRowSelection] = React.useState({});

  if (columns.at(0)?.id != "select") {
    columns.unshift({
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="mr-3"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    });
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const filterList: string[] = columns.map((item: any) => item.accessorKey);
  const [filter, setFilter] = useState(filterList[0] || "id");
  const [pageIndex, setPageIndex] = useState<number>(1);

  useEffect(() => {
    if (setSelected) setSelected(table.getSelectedRowModel());
  }, [table.getSelectedRowModel().rows.length, table.getRowCount()]);

  return (
    <div className="flex flex-col min-w-full px-3 md:min-w-[80%] ">
      {/* Search + New */}
      <div className="[&>*]:flex [&>*]:gap-2 [&>*]:items-center py-4 flex gap-2 flex-col md:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Search records..."
            value={(table.getColumn(filter)?.getFilterValue() as string) ?? ""}
            onChange={(event) => {
              // console.log(table.getColumn(filter));
              table.getColumn(filter)?.setFilterValue(event.target.value);
            }}
            className="flex-1"
          />
          {/* Search Filter */}
          <Select
            onValueChange={(value) => setFilter(value)}
            defaultValue={filter}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="filter" />
            </SelectTrigger>
            <SelectContent>
              {filterList.map((item: string, i: number) => (
                <SelectItem value={item} key={i}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="">
          {/* Columns Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* New Button */}
          {onCreate && <Button onClick={onCreate}>New</Button>}
        </div>
      </div>

      {/* Selected n of total + Delete */}
      <div className="mb-3 flex gap-2 items-center h-[36px]">
        <div>
          {`Selected ${
            table.getSelectedRowModel().rows.length
          } of ${table.getRowCount()}`}
        </div>
        {table.getSelectedRowModel().rows.length > 0 && onSelectUI}
      </div>

      {/* Table Continaer */}
      <div className="rounded border">
        {/* table */}
        <Table className="h-32 overflow-auto">
          <TableHeader className="bg-secondary">
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="pr-3 whitespace-nowrap">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination + Controls*/}
        {(table.getCanNextPage() || table.getCanPreviousPage()) && (
          <div className="flex items-center space-x-2 py-4 px-3">
            <div className="flex-1">
              Page {pageIndex} of {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => [
                table.previousPage(),
                setPageIndex(pageIndex - 1),
              ]}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => [table.nextPage(), setPageIndex(pageIndex + 1)]}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
