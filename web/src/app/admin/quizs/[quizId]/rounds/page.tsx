"use client";
import { useEffect, useState } from "react";
import { Round, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import AdminNav from "@/components/admin-navbar";
import { formatISODate } from "@/util/datetime";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormType, RoundForm } from "./form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function TestsPage({ params }: any) {
  const { quizId } = params;
  const [data, setData] = useState<Round[]>([]);
  // console.log(JSON.stringify(data));
  const [loading, setLoading] = useState<string>("Loading ...");
  const [delDialog, setDelDialog] = useState({
    name: "",
    id: -1,
    open: false,
  });

  const dfd = {
    // default form data
    name: "",
    // order: 0,
    easyQ: 0,
    mediumQ: 0,
    hardQ: 0,
  };

  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    variant: "create" | "update";
    id: number;
    defaultData: FormType;
  }>({
    open: false,
    variant: "create",
    id: -1,
    defaultData: dfd,
  });
  // const [retry, setRetry] = useState(1);

  // get all rounds for current quiz
  const fetchAllRounds = () => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/rounds/quiz/" + quizId)
      .then((res) => res.json())
      .then((newdata: Round[]) => {
        setData(
          newdata.map((dataitem: Round) => ({
            ...dataitem,
            // startTiming: formatISODate(dataitem.startTiming),
            createdAt: formatISODate(dataitem.createdAt),
            updatedAt: formatISODate(dataitem.updatedAt),
            edit: () => openEditDialog(dataitem.id, newdata),
            delete: () => openDeleteDialog(dataitem.id, newdata),
          }))
        );
        setLoading("");
      })
      .catch((e) => {
        setLoading(`Error while fetching Rounds`);
        // setRetry(retry + 1);
        // setTimeout(() => fetchAllRounds(), 1000);
        console.error(e);
      });
  };

  useEffect(() => fetchAllRounds(), []);

  const doCreate = async (values: any) => {
    // console.log(values);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/rounds",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ ...values, quizId: parseInt(quizId) }),
        }
      );

      if (res.status < 400) {
        toast("Round created Successfully");
        fetchAllRounds();
      } else {
        const json = await res.json();
        toast("Failed to create Round", {
          action: {
            label: "copy",
            onClick: () =>
              navigator.clipboard.writeText(
                JSON.stringify({ error: "Round Create Error", message: json })
              ),
          },
        });
      }
    } catch (e) {
    } finally {
      setFormDialog({
        open: false,
        variant: "create",
        id: -1,
        defaultData: dfd,
      });
    }
  };

  const showCreateDialog = () => {
    setFormDialog({
      open: true,
      variant: "create",
      id: -1,
      defaultData: dfd,
    });
  };

  const openDeleteDialog = (id: number, data: Round[]) => {
    setDelDialog({
      open: true,
      name: data.find((item) => item.id == id)?.name || "",
      id,
    });
  };

  function openEditDialog(id: number, data: Round[]) {
    // const openEditDialog = (id: number) => {
    const d = data.find((item) => item.id == id) as FormType;
    // console.log("id:", id, "data:", d, data);
    console.log("data", data);
    setFormDialog({
      open: true,
      variant: "update",
      id: id,
      defaultData: d,
    });
  }

  const doEdit = async (values: FormType) => {
    const { id } = formDialog;
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/rounds/" + id,
        {
          method: "PUT",
          body: JSON.stringify(values),
          headers: {
            "content-type": "application/json",
          },
        }
      );
      if (res.status < 400) {
        toast("Round updated succesfully !");
        setFormDialog({ ...formDialog, open: false });
        setData(
          data.map((item) => (item.id == id ? { ...item, ...values } : item))
        );
        fetchAllRounds();
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
    } catch (e) {
    } finally {
      setFormDialog({
        open: false,
        id: -1,
        variant: "update",
        defaultData: dfd,
      });
    }
  };

  const doDelete = async (id: number) => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/rounds/" + id,
        { method: "DELETE" }
      );
      if (res.status < 400) {
        toast("Round deleted successfully");
      } else {
        const json = await res.json();
        toast("Failed to delete quiz : " + res.status, {
          // description: json.message,
          action: {
            label: "copy",
            onClick: () =>
              navigator.clipboard.writeText(
                JSON.stringify({ error: "Delete Error", id, message: json })
              ),
          },
        });
        setDelDialog({ ...delDialog, open: false, id: -1, name: "" });
        fetchAllRounds();
      }
    } catch (err: any) {
      toast("Failed to delete Round (catched) ", {
        description: err.message,
        action: {
          label: "copy",
          onClick: () =>
            navigator.clipboard.writeText(
              JSON.stringify({
                error: "Delete Error",
                id,
                message: err.message,
              })
            ),
        },
      });
    } finally {
      setDelDialog({ ...delDialog, name: "", id: -1, open: false });
      fetchAllRounds();
    }
  };

  
  const deleteMany = ({ rows }: any) => {
    console.log(rows);
  };

  return (
    <div>
      <AdminNav
        backHref={"/admin/quizs"}
        path={[
          { label: "Admin", href: "/admin" },
          { label: "Quizzes", href: "/admin/quizs" },
          { label: "Rounds", href: `/admin/quizs/${quizId}/rounds` },
        ]}
      />
      <div className="w-full min-h-screen flex justify-center">
        {loading ? (
          loading
        ) : (
          <DataTable
              openCreateDialog={showCreateDialog}
              columns={columns}
              data={data} onSelectedDelete={deleteMany}          />
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
              onClick={() => doDelete(delDialog.id)}
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
              {formDialog.variant == "create" ? "Create Round" : "Edit Round"}
            </DialogTitle>
          </DialogHeader>
          <RoundForm
            defaultData={formDialog.defaultData}
            handleSubmit={formDialog.variant == "create" ? doCreate : doEdit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
