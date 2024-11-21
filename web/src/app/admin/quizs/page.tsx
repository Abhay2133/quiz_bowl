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
import { headers } from "next/headers";

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
  async function fetchAllTests() {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/quizs", {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    })
      .then((res) => res.json())
      .then((newdata: Test[]) => {
        setData(
          newdata.map((dataitem) => ({
            ...dataitem,
            // date: dataitem.startTiming,
            delete: () => handleDelete(dataitem.id, newdata),
            edit: () => showUpdateDialog(dataitem.id, newdata),
          }))
        );
        setPlaceholder("");
      })
      .catch((e) => {
        setPlaceholder("ERROR LOADING TESTs : " + e.message);
      });
  }

  useEffect(() => {
    fetchAllTests().catch(() => setTimeout(fetchAllTests, 500));
  }, []);

  // post quiz data to server
  function handleCreate(values: any) {
    const formData = {
      ...values,
      duration: parseInt(values.duration),
      startTiming: convertToISODateTime(values.startTiming),
      date: convertToISODate(values.date),
    };

    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/quizs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data: any) => {
        console.log(data);
        setFormDialog({ ...formDialog, open: false });
        toast(`Test "${data.name}" Create succesfully`);
        fetchAllTests();
        // fetchData();
      })
      .catch(() => {});
  }

  // open dialog for deletion
  async function handleDelete(quizId: number, data: any) {
    console.log("data", { data: data, quizId });
    // if (!data.some((item) => item.id == quizId)) return console.log(`quizId ${quizId} not found`,data);
    setDelDialog({
      ...delDialog,
      open: true,
      name: data.find((item: any) => item.id == quizId)?.name as any,
      quizId,
    });
    // confirmDelete(quizId);
  }

  // opens update dialog and set updateId
  async function showUpdateDialog(updateId: number, data: any) {
    const item = data.find((i: any) => i.id == updateId);
    console.log("in sud", { id: updateId, data });
    setFormDialog({
      ...formDialog,
      variant: "update",
      updateId: updateId,
      open: true,
      defaultData: {
        ...item,
        startTiming: convertIsoToTime(item.startTiming),
        date: convertIsoToDate(item.date),
      },
    });
  }

  // send fetch for update
  async function putUpdate(values: any) {
    const formData = {
      ...values,
      duration: parseInt(values.duration),
      startTiming: convertToISODateTime(values.startTiming),
      date: convertToISODate(values.date),
    };
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/quizs/" + formDialog.updateId,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (res.status < 400) {
        toast("Test updated");
      } else {
        const json = await res.json();
        toast("Failed to update quiz", {
          // description: json.message,
          action: {
            label: "copy",
            onClick: () =>
              navigator.clipboard.writeText(
                JSON.stringify({ error: "Update Error", message: json })
              ),
          },
        });
      }
    } catch (e: any) {
    } finally {
      setFormDialog({ ...formDialog, open: false });
    }
  }

  // send the fetch request for deletion
  async function confirmDelete(quizId: number) {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/quizs/" + quizId,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      if (res.status < 400) {
        toast("Test deleted successfully");
      } else {
        const json = await res.json();
        toast("Failed to delete quiz", {
          // description: json.message,
          action: {
            label: "copy",
            onClick: () =>
              navigator.clipboard.writeText(
                JSON.stringify({ error: "Delete Error", quizId, message: json })
              ),
          },
        });
        setDelDialog({ ...delDialog, open: false, quizId: -1, name: "" });
      }
    } catch (err: any) {
      toast("Failed to delete quiz", {
        description: err.message,
        action: {
          label: "copy",
          onClick: () =>
            navigator.clipboard.writeText(
              JSON.stringify({
                error: "Delete Error",
                quizId,
                message: err.message,
              })
            ),
        },
      });
    }
    setDelDialog({ ...delDialog, name: "", quizId: -1, open: false });
    fetchAllTests();
  }

  //
  function openCreateDialog() {
    setFormDialog({
      ...formDialog,
      variant: "create",
      open: true,
      defaultData: {
        name: "",
        duration: "60",
        startTiming: "",
        date: "",
        quizcode: "",
      },
    });
  }

  const deleteMany = ({ rows }: any) => {
    console.log(rows);
  };

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
            onCreate={openCreateDialog}
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

      {/* Delete Dialog */}
      <Dialog
        open={delDialog.open}
        onOpenChange={(val) => setDelDialog({ ...delDialog, open: val })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Test</DialogTitle>
            <DialogDescription>{`Delete quiz "${delDialog.name}"`}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"destructive"}
              onClick={() => confirmDelete(delDialog.quizId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Dialog */}
      <Dialog
        open={formDialog.open}
        onOpenChange={(val) => setFormDialog({ ...formDialog, open: val })}
      >
        <DialogContent className="sm:max-w-[425px] w-[90%] mx-auto rounded-lg overflow-y-auto max-h-[95%]">
          <DialogHeader>
            <DialogTitle>
              {formDialog.variant == "create" ? "Create Test" : "Edit Test"}
            </DialogTitle>
          </DialogHeader>
          <TestForm
            defaultData={formDialog.defaultData}
            handleSubmit={
              formDialog.variant == "create" ? handleCreate : putUpdate
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
