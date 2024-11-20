"use client";
import { useEffect, useState } from "react";
import { Submission, columns } from "./columns";
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
import {
  deleteSubmission,
  fetchSubmissions,
} from "@/services/submissionService";
import ConfirmDialog from "@/components/confirm-dialog";
import { number } from "zod";
import { errorToast } from "@/util/errors";

export default function SubmissionsPage() {
  const [data, setData] = useState<Submission[]>([]);

  const [loading, setLoading] = useState<string>("Loading ...");
  const [delDialog, setDelDialog] = useState({
    // name: "",
    submissionId: -1,
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
        setLoading("");
        setData(
          submissions.map((sub: any) => {
            return { ...sub, delete: () => onDelete(sub.id) };
          })
        );
      })
      .catch((e) => {
        setLoading("ERROR LOADING TESTs : " + e.message);
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
    setDelDialog({
      open: true,
      submissionId: id,
    });
  };
  const doDelete = async () => {
    try {
      const res = await deleteSubmission(delDialog.submissionId);
      if (res.status < 400) {
        toast("Submission deleted successfully");
      } else {
        errorToast(
          `Failed to Delete submission(id:${delDialog.submissionId})`,
          { message: await res.text() }
        );
      }
      loadData();
    } catch (e: any) {
      errorToast("Failed to delete submission", e);
    } finally {
      setDelDialog({ open: false, submissionId: -1 });
    }
  };

  return (
    <div>
      <AdminNav
        backHref={"/admin"}
        path={[
          { label: "Admin", href: "/admin" },
          { label: "Submissions", href: "/admin/submissions" },
        ]}
      />
      <div className="w-full h-screen flex justify-center pb-5">
        {loading ? (
          loading
        ) : (
          // Main Data table
          <DataTable
            onCreate={onCreate}
            columns={columns}
            data={data.map((item) => ({
              ...item,
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
        footer={
          <Button variant={"destructive"} onClick={doDelete}>
            Delete
          </Button>
        }
        open={delDialog.open}
        onOpenChange={(open: boolean) => setDelDialog({ ...delDialog, open })}
      />
    </div>
  );
}
