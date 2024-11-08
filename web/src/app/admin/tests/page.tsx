"use client";
import { useEffect, useState } from "react";
import { Test, columns } from "./columns";
import { DataTable } from "./data-table";
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

export default function TestsPage() {
  const [data, setData] = useState<Test[]>([]);

  const [placeholder, setPlaceholder] = useState<string>("Loading ...");
  const [delDialog, setDelDialog] = useState({
    name: "",
    testId: -1,
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
      testcode: "",
    },
  });

  // get all tests
  async function fetchAllTests() {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/tests")
      .then((res) => res.json())
      .then((newdata: Test[]) => {
        setData(
          newdata.map((dataitem) => ({
            ...dataitem,
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

  // post test data to server
  function handleCreate(values: any) {
    const formData = {
      ...values,
      duration: parseInt(values.duration),
      startTiming: convertToISODateTime(values.startTiming),
      date: convertToISODate(values.date),
    };

    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/tests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
  async function handleDelete(testId: number, data: any) {
    console.log("data", { data: data, testId });
    // if (!data.some((item) => item.id == testId)) return console.log(`testId ${testId} not found`,data);
    setDelDialog({
      ...delDialog,
      open: true,
      name: data.find((item: any) => item.id == testId)?.name as any,
      testId,
    });
    // confirmDelete(testId);
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
        process.env.NEXT_PUBLIC_BASE_URL + "/api/tests/" + formDialog.updateId,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (res.status < 400) {
        toast("Test updated");
      } else {
        const json = await res.json();
        toast("Failed to update test", {
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
  async function confirmDelete(testId: number) {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/tests/" + testId,
        { method: "DELETE" }
      );
      if (res.status < 400) {
        toast("Test deleted successfully");
      } else {
        const json = await res.json();
        toast("Failed to delete test", {
          // description: json.message,
          action: {
            label: "copy",
            onClick: () =>
              navigator.clipboard.writeText(
                JSON.stringify({ error: "Delete Error", testId, message: json })
              ),
          },
        });
        setDelDialog({ ...delDialog, open: false, testId: -1, name: "" });
      }
    } catch (err: any) {
      toast("Failed to delete test", {
        description: err.message,
        action: {
          label: "copy",
          onClick: () =>
            navigator.clipboard.writeText(
              JSON.stringify({
                error: "Delete Error",
                testId,
                message: err.message,
              })
            ),
        },
      });
    }
    setDelDialog({ ...delDialog, name: "", testId: -1, open: false });
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
        testcode: "",
      },
    });
  }

  return (
    <div>
      <AdminNav
        backHref={"/admin"}
        path={[
          { label: "Admin", href: "/admin" },
          { label: "Tests", href: "/admin/tests" },
        ]}
      />
      <div className="w-full h-screen flex justify-center">
        {placeholder ? (
          placeholder
        ) : (
          // Main Data table
          <DataTable
            openCreateDialog={openCreateDialog}
            columns={columns}
            data={data.map((item) => ({
              ...item,
              startTiming: convertIsoToTime(item.startTiming),
              date: convertIsoToDate(item.date),
            }))}
          />
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={delDialog.open}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Test</DialogTitle>
            <DialogDescription>{`Delete test "${delDialog.name}"`}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant={"destructive"}
              onClick={() => confirmDelete(delDialog.testId)}
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
