"use client";

import AdminNav from "@/components/admin-navbar";
import { DataTable } from "@/components/data-table";
import { Loader2, LoaderIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { columns, LiveQuiz } from "./columns";
import { errorToast } from "@/util/errors";
import {
  deleteLiveQuizById,
  getAllLiveQuizzes,
  udpateLiveQuizById,
} from "@/services/liveQuizService";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmDialog from "@/components/confirm-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LiveQuizForm } from "./form";

const Loading = () => {
  return (
    <div className="flex flex-col my-10 mx-auto items-center gap-3">
      <Loader2 className=" animate-spin" size={40} />
      {/* <div>Loading</div> */}
    </div>
  );
};

export default function LiveQuizPage() {
  const router = useRouter();
  const [data, setData] = useState<LiveQuiz[]>([]);
  const [loading, setLoading] = useState<string | ReactNode>(<Loading />);
  const _loadData = async () => {
    setLoading(<Loading />);
    try {
      const newdata = await getAllLiveQuizzes();
      if (newdata.error) {
        setLoading(`Failed to load Live Quizzes ${JSON.stringify(newdata)}`);
        return errorToast("Failed to load Live Quizzes", { message: newdata });
      }

      setData(
        newdata.map((live: Partial<LiveQuiz>) => ({
          ...live,
          onOpen: () => _onOpen(live),
          edit: () => _onEdit(live),
          delete: () => _onDelete(live),
        }))
      );
      setLoading("");
    } catch (e: any) {
      setLoading(
        <div className="flex flex-col items-center gap-3">
          Failed to load Live Quizzes : {JSON.stringify(e)}
          <br />
          <Button variant={"outline"} onClick={_loadData}>
            Retry
          </Button>
        </div>
      );
      errorToast(`Failed to Load LiveQuizzes`, e);
    }
  };
  useEffect(() => {
    _loadData();
  }, []);

  const _onOpen = (liveQuiz: Partial<LiveQuiz>) => {
    router.push(`/admin/live/${liveQuiz.id}`);
  };

  const _onEdit = (liveQuiz: Partial<LiveQuiz>) => {
    setFormDialog((old) => ({ liveQuiz, open: true }));
  };

  const _onDelete = (liveQuiz: Partial<LiveQuiz>) => {
    setDelDialog({
      open: true,
      liveQuiz: liveQuiz,
    });
  };
  const _doDelete = async (liveQuiz: Partial<LiveQuiz>, cb?: any) => {
    try {
      if (!liveQuiz.id) return toast(`Invalid liveQuiz id (${liveQuiz.id})`);
      toast(`Deleting Live-Quiz '${liveQuiz.name}' `);
      const res = await deleteLiveQuizById(liveQuiz.id);
      if (res.status < 400) {
        _loadData();
        toast(`Deleted liveQuiz '${liveQuiz.name}' successfully`);
      } else {
        const e = await res.json();
        errorToast(`Failed to Delete liveQuiz "${liveQuiz.name}"`, e);
      }
    } catch (e) {
      errorToast(`Failed to Delete liveQuiz "${liveQuiz.name}"`, e);
    } finally {
      if (cb) cb();
    }
  };

  const _onCreate = async () => {
    router.push(`/admin/live/new`);
  };

  const [delDialog, setDelDialog] = useState<{
    liveQuiz: Partial<LiveQuiz> | null;
    open: boolean;
  }>({
    liveQuiz: null,
    open: false,
  });

  const [formDialog, setFormDialog] = useState<{
    liveQuiz: Partial<LiveQuiz> | null;
    open: boolean;
  }>({
    liveQuiz: null,
    open: false,
  });

  const _doEdit = async (values: any) => {
    values = { ...values, isAnswerAllowed: values.isAnswerAllowed === "TRUE" };

    if (!formDialog.liveQuiz?.id)
      return toast(`invalid id while editing (${formDialog.liveQuiz?.id})`);
    try {
      const res = await udpateLiveQuizById(formDialog.liveQuiz?.id, values);
      if (res.status < 400) {
        toast(`'${formDialog.liveQuiz.name}' edited successfully`);
        _loadData();
      } else {
        const error = await res.json();
        errorToast(`Unable to Edit '${delDialog.liveQuiz?.name}'`, error);
      }
    } catch (error) {
      errorToast(`Error whlie Editing '${delDialog.liveQuiz?.name}'`, error);
    } finally {
      setFormDialog((old) => ({ ...old, open: false }));
    }
  };

  return (
    <div>
      <AdminNav
        backHref={"/admin"}
        path={[{ label: "Admin", href: "/admin" }, { label: "Live" }]}
      />
      <h1 className="text-2xl text-center">Live Quizzes</h1>
      <div className="w-full min-h-screen flex justify-center pb-5">
        {loading ? (
          loading
        ) : (
          <DataTable columns={columns} data={data} onCreate={_onCreate} />
        )}
      </div>

      {/* Delete confimation dialog */}
      <ConfirmDialog
        title={`Delete "${delDialog.liveQuiz?.name}"`}
        body={`All the submission will also get deleted`}
        footer={
          <Button
            variant={"destructive"}
            onClick={() =>
              delDialog.liveQuiz &&
              _doDelete(
                delDialog.liveQuiz,
                setDelDialog((old) => ({ ...old, open: false }))
              )
            }
          >
            Delete
          </Button>
        }
        open={delDialog.open}
        onOpenChange={(open: boolean) =>
          setDelDialog((old) => ({ ...old, open }))
        }
      />

      {/* Update Form */}
      <Dialog
        open={formDialog.open}
        onOpenChange={(val) => setFormDialog({ ...formDialog, open: val })}
      >
        <DialogContent className="sm:max-w-[425px] w-[90%] mx-auto rounded-lg overflow-y-auto max-h-[95%]">
          <DialogHeader>
            <DialogTitle>Edit Live-Quiz</DialogTitle>
          </DialogHeader>
          <LiveQuizForm
            defaultData={{
              ...formDialog.liveQuiz,
              isAnswerAllowed: "" + formDialog?.liveQuiz?.isAnswerAllowed,
            }}
            handleSubmit={_doEdit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
