"use client";
import { useEffect, useState } from "react";
import { Question, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import AdminNav from "@/components/admin-navbar";
import { formatISODate } from "@/util/datetime";
import { RowModel } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import {
  Answer,
  DifficultyLevel,
  FormType,
  QuestionForm,
  QuestionType,
} from "./form";
import { headers } from "next/headers";

const defaultFormData = {
  question: "",
  answer: "" as any,
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  type: "TEXT" as QuestionType,
  link: "",
  difficulty: "EASY" as DifficultyLevel,
};

export default function TestsPage({ params }: any) {
  const { quizId, roundId } = params;
  const [data, setData] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<RowModel<any>>();
  const [delManyDialog, setDelManyDialog] = useState({
    open: false,
    ids: Array<number>(),
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
    defaultData: { ...defaultFormData },
  });

  const [delDialog, setDelDialog] = useState({
    name: "",
    id: -1,
    open: false,
  });

  const fetchAllData = () => {
    fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/questions/round/" + roundId,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      }
    )
      .then((res) => res.json())
      .then((newdata: Question[]) => {
        setData(
          newdata.map((dataitem: Question) => ({
            ...dataitem,
            createdAt: formatISODate(dataitem.createdAt),
            updatedAt: formatISODate(dataitem.updatedAt),
            delete: () => onDelete(dataitem.id, newdata),
            edit: () => onEdit(dataitem.id, newdata),
            quizId,
            roundId,
          }))
        );
        setLoading(false);
      });
  };

  useEffect(fetchAllData, []);

  const onCreate = () => {
    setFormDialog({
      open: true,
      variant: "create",
      id: -1,
      defaultData: { ...defaultFormData },
    });
  };

  function onEdit(id: number, data: Question[]) {
    // const openEditDialog = (id: number) => {
    const d = data.find((item) => item.id == id) as FormType;
    // console.log("id:", id, "data:", d, data);
    console.log("data", data);
    setFormDialog({
      open: true,
      variant: "update",
      id: id,
      defaultData: { ...d, link: d.link || "" },
    });
  }

  const doCreate = async (values: any) => {
    console.log(values);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/questions",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify({ ...values, roundId: parseInt(roundId) }),
        }
      );

      if (res.status < 400) {
        toast("Question created Successfully");
        fetchAllData();
      } else {
        const json = await res.json();
        toast("Failed to create Question", {
          action: {
            label: "copy",
            onClick: () =>
              navigator.clipboard.writeText(
                JSON.stringify({
                  error: "Question Create Error",
                  message: json,
                })
              ),
          },
        });
      }
    } catch (e: any) {
      console.error(e);
      toast("Failed to create Question", {
        action: {
          label: "copy",
          onClick: () =>
            navigator.clipboard.writeText(
              JSON.stringify({
                error: "Question Create Error",
                message: e.message,
              })
            ),
        },
      });
    } finally {
      setFormDialog({
        open: false,
        variant: "create",
        id: -1,
        defaultData: defaultFormData,
      });
    }
  };

  const doEdit = async (values: FormType) => {
    const { id } = formDialog;
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/questions/" + id,
        {
          method: "PUT",
          body: JSON.stringify(values),
          headers: {
            "content-type": "application/json",
          },
        }
      );
      if (res.status < 400) {
        toast("Question updated succesfully !");
        setFormDialog({ ...formDialog, open: false });
        setData(
          data.map((item) => (item.id == id ? { ...item, ...values } : item))
        );
        fetchAllData();
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

  const onDelete = (id: number, questions: Question[]) => {
    setDelDialog({
      open: true,
      name:
        questions.find((item) => item.id == id)?.question.slice(0, 20) || "",
      id,
    });
  };

  const doDelete = async (id: number) => {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/questions/" + id,
        { method: "DELETE" }
      );
      if (res.status < 400) {
        toast("Question deleted successfully");
      } else {
        const json = await res.json();
        toast("Failed to delete Question : " + res.status, {
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
        fetchAllData();
      }
    } catch (err: any) {
      toast("Failed to delete Question (catched) ", {
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
      fetchAllData();
    }
  };

  // ---- Delete Many

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
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/delete-many`,
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
      }
    } catch (e) {
      console.error(e);
      toast("Failed to Delete Many Questions");
    } finally {
      setDelManyDialog({ open: false, ids: [] });
    }
  };

  return (
    <div>
      <AdminNav
        backHref={`/admin/quizs/${quizId}/rounds`}
        path={[
          { label: "Admin", href: "/admin" },
          { label: "Quizzes", href: "/admin/quizs" },
          { label: "Rounds", href: `/admin/quizs/${quizId}/rounds` },
          { label: "Questions" },
        ]}
      />

      {/* Data - Table */}
      <div className="w-full min-h-screen flex justify-center pb-5">
        {loading ? (
          "Loading"
        ) : (
          <DataTable
            columns={columns}
            data={data}
            onCreate={onCreate}
            onSelectUI={
              <Button
                className="p-3 rounded"
                variant={"destructive"}
                onClick={() => onDeleteMany()}
              >
                <TrashIcon size={20} />
              </Button>
            }
            setSelected={setSelected}
          />
        )}
      </div>

      {/* Delete One Dialog */}
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

      {/* Form Dialog */}
      <Dialog
        open={formDialog.open}
        onOpenChange={(val) => setFormDialog({ ...formDialog, open: val })}
      >
        <DialogContent className="sm:max-w-[425px] w-[90%] mx-auto rounded-lg overflow-y-auto max-h-[95%]">
          <DialogHeader>
            <DialogTitle>
              {formDialog.variant == "create"
                ? "Create Question"
                : "Edit Question"}
            </DialogTitle>
          </DialogHeader>
          <QuestionForm
            defaultData={formDialog.defaultData}
            handleSubmit={formDialog.variant == "create" ? doCreate : doEdit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
