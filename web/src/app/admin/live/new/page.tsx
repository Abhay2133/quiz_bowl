"use client";

import AdminNav from "@/components/admin-navbar";
import { DataTable } from "@/components/data-table";
import { Loader2, LoaderIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { columns, Quiz } from "./columns";
import { errorToast } from "@/util/errors";
import {
  createLiveQuizbyQuizcode,
  getAllLiveQuizzes,
} from "@/services/liveQuizService";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  const [data, setData] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<string | ReactNode>(<Loading />);

  async function loadData() {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/not-live-quizs",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      if (res.status < 400) {
        const newdata = await res.json();
        setData(
          newdata.map((dataitem: any) => ({
            ...dataitem,
            // date: dataitem.startTiming,
            create: () => _onCreate(dataitem),
          }))
        );
        setLoading("");
      } else {
        // text containing error message
        const text = await res.text();
        errorToast("Failed to load quiz data", { message: text });
        if (res.status == 401) {
          setLoading(
            <div>
              Unauthorised user
              <br />
              <Link href="/login/admin">
                <Button>Admin Login</Button>
              </Link>
            </div>
          );
        } else {
          setLoading(
            <div className="m-10 text-center">
              {"Error Loading Quizzes : " + text}
            </div>
          );
        }
      }
    } catch (e: any) {
      setLoading(
        <div className="m-10 text-center">
          {"Error Loading Quizzes : " + e.message}
        </div>
      );
    } finally {
    }
  }

  useEffect(() => {
    loadData().catch(() => setTimeout(loadData, 500));
  }, []);

  const _onCreate = async (quiz: Quiz) => {
    // console.log(quiz)
    toast(`Create LiveQuiz for '${quiz.name}'`);
    try {
      const res = await createLiveQuizbyQuizcode(quiz.quizcode);
      if (res.status < 400) {
        toast(`LiveQuiz generated Successfully for "${quiz.name}"`);
        loadData();
      } else {
        const e = await res.json();
        errorToast(`Failed to create LiveQuiz for '${quiz.name}'`, e);
      }
    } catch (e) {
      errorToast(`Failed to create LiveQuiz for '${quiz.name}'`, e);
    }
  };

  return (
    <div>
      <AdminNav
        backHref={"/admin/live"}
        path={[{ label: "Admin", href: "/admin" }, { label: "Live" }]}
      />
      <h1 className="text-xl text-center">Create new Live-Quiz from Quizzes</h1>
      <div className="w-full min-h-screen flex justify-center pb-5">
        {loading ? loading : <DataTable columns={columns} data={data} />}
      </div>
    </div>
  );
}
