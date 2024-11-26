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
} from "@/services/liveQuizService";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Loading = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <Loader2 className=" animate-spin" size={40} />
      <div>Loading</div>
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

  const _onEdit = (liveQuiz: Partial<LiveQuiz>) => {};
  const _onDelete = async (liveQuiz: Partial<LiveQuiz>) => {
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
    }
  };

  const _onCreate = async () => {
    router.push(`/admin/live/new`);
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
    </div>
  );
}
