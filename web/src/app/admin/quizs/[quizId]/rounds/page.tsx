"use client";
import { ReactNode, useEffect, useState } from "react";
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
import { TrashIcon } from "lucide-react";
import { RowModel } from "@tanstack/react-table";

const defaultFormData = {
  name: "",
  easyQ: 0,
  mediumQ: 0,
  hardQ: 0,
};

export default function TestsPage({ params }: any) {
  const { quizId } = params;
  const [data, setData] = useState<Round[]>([]);
  // console.log(JSON.stringify(data));
  const [loading, setLoading] = useState<ReactNode>(<div>Loading ...</div>);
  const [delDialog, setDelDialog] = useState({
    name: "",
    id: -1,
    open: false,
  });

  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    variant: "create" | "update";
    id: number;
    defaultData: FormType;
  }>({
    open: false,
    variant: "create",
    id: -1,
    defaultData: defaultFormData,
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
            edit: () => onEdit(dataitem.id, newdata),
            delete: () => onDelete(dataitem.id, newdata),
          }))
        );
        setLoading("");
      })
      .catch((e) => {
        setLoading(
          <div>
            {`Error while fetching Rounds`}
            <br />
            <Button className="rounded-full">Retry</Button>
          </div>
        );
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
        defaultData: defaultFormData,
      });
    }
  };

  const onCreate = () => {
    setFormDialog({
      open: true,
      variant: "create",
      id: -1,
      defaultData: { ...defaultFormData },
    });
  };

  function onEdit(id: number, data: Round[]) {
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
        defaultData: defaultFormData,
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
  
  const onDelete = (id: number, data: Round[]) => {
    setDelDialog({
      open: true,
      name: data.find((item) => item.id == id)?.name || "",
      id,
    });
  };

  // ------ STATE FOR DELETE MANY ------

  const [delManyDialog, setDelManyDialog] = useState({
    open: false,
    ids: Array<number>(),
  });

  const [selected, setSelected] = useState<RowModel<any>>();

  const onDeleteMany = async () => {
    if (!selected) return;
    const { rows } = selected;
    // console.log(rows);
    const ids = rows.map((row) => row.original.id);
    setDelManyDialog({ open: true, ids });
  };

  const doDeleteMany = async () => {
    try {
      const { ids } = delManyDialog;
      const idsSet = new Set(ids);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/rounds/delete-many`,
        {
          method: "POST",
          body: JSON.stringify({ ids }),
          headers: { "content-type": "application/json" },
        }
      );
      if (response.status < 400) {
        setData(data.filter((item: any) => !idsSet.has(item.id)));
        toast(`Deleted ${ids.length} records`);
      } else {
        const json = await response.json();
        toast("Failed to delete selected rows : " + json.error);
      }
    } catch (e) {
      console.error(e);
      toast("Failed to delete selected rows");
    } finally {
      setDelManyDialog({ open: false, ids: [] });
    }
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
            onCreate={onCreate}
            columns={columns}
            data={data}
            onSelectUI={
              <Button variant={"destructive"} onClick={() => onDeleteMany()}>
                <TrashIcon size={20} />
              </Button>
            }
            setSelected={setSelected}
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

      {/* Delete Many Dialog */}
      <Dialog
        open={delManyDialog.open}
        onOpenChange={(open) => setDelManyDialog({ ...delManyDialog, open })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Selected</DialogTitle>
            <DialogDescription>
              Confirm to delete all the selected questions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button type="submit" variant={"outline"}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={"destructive"}
              onClick={doDeleteMany}
            >
              Delete Selected
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
