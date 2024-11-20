"use client";
import { useEffect, useState } from "react";
import { Test, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import AdminNav from "@/components/admin-navbar";
import {
  convertIsoToDate,
  convertIsoToTime,
  convertToISODate,
  convertToISODateTime,
} from "@/util/datetime";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TestForm } from "./form";
import { RowModel } from "@tanstack/react-table";
import { TrashIcon } from "lucide-react";
import { fetchSubmissions } from "@/services/submissionService";
import ConfirmDialog from "@/components/confirm-dialog";

export default function TestsPage() {
  const [data, setData] = useState<Test[]>([]);

  const [placeholder, setPlaceholder] = useState<string>("Loading ...");
  const [delDialog, setDelDialog] = useState({
    name: "",
    quizId: -1,
    open: false,
  });

  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    variant: "create" | "update";
    updateId: number;
    defaultData: any;
  }>({
    open: false,
    variant: "create",
    updateId: -1,
    defaultData: {
      name: "",
      duration: "60",
      startTiming: "",
      date: "",
      quizcode: "",
    },
  });

  // get all quizs
  async function loadData() {
    fetchSubmissions()
      .then((submissions) => {
        setData(
          submissions.map((sub: any) => {
            return { ...sub,delete: ()=>onDelete(sub.id) };
          })
        );
      })
      .catch((e) => {
        setPlaceholder("ERROR LOADING TESTs : " + e.message);
      });
  }

  useEffect(() => {
    loadData().catch(() => setTimeout(loadData, 500));
  }, []);

  const onCreate = async () => {};
  const doCreate = async () => {};

  const onEdit = async (id: number, _data: any) => {};
  const doEdit = async () => {};

  const onDelete = async (id: number) => {
    // setDelDialog;
  };
  const doDelete = async () => {};

  return (
    <div>
      <AdminNav
        backHref={"/admin"}
        path={[
          { label: "Admin", href: "/admin" },
          { label: "Quizzes", href: "/admin/quizs" },
        ]}
      />
      <div className="w-full h-screen flex justify-center pb-5">
        {placeholder ? (
          placeholder
        ) : (
          // Main Data table
          <DataTable
            onCreate={onCreate}
            columns={columns}
            data={data.map((item) => ({
              ...item,
              startTiming: convertIsoToTime(item.startTiming),
              date: convertIsoToDate(item.date),
            }))}
            // onSelectedDelete={deleteMany}
            onSelectUI={null}
          />
        )}
      </div>

      {/* Delete One Confirmation */}
      <ConfirmDialog
        title={"Delete Submission"}
        body={`Deleted submission cannot be recovered again.`}
        footer={<Button variant={"destructive"}>Delete</Button>}
        open={delDialog.open}
        onOpenChange={(open: boolean) => setDelDialog({ ...delDialog, open })}
      />
    </div>
  );
}
