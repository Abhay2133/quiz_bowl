"use client";
import { useEffect, useState } from "react";
import { Team, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import AdminNav from "@/components/admin-navbar";
import { formatISODate } from "@/util/datetime";
import { useRouter } from "next/navigation";
import { errorToast } from "@/util/errors";
import { removeTeamFromQuiz } from "@/services/teamService";
import { toast } from "sonner";

export default function TestsPage({ params }: any) {
  const { quizId } = params;
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/teams/quiz/" + quizId, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    })
      .then((res) => res.json())
      .then((newdata: Team[]) => [
        setData(
          newdata.map((dataitem: Team) => ({
            ...dataitem,
            createdAt: formatISODate(dataitem.createdAt),
            updatedAt: formatISODate(dataitem.updatedAt),
            quizId,
            remove: () => onRemove(dataitem.id),
          }))
        ),
        setLoading(false),
      ]);
  }, []);

  const router = useRouter();
  const onCreate = () => {
    router.push("teams/add");
  };

  const onRemove = async (teamId: number) => {
    try {
      const res = await removeTeamFromQuiz(teamId, quizId);
      if (res.status < 400) {
        toast(
          `Team removed from quiz`
        );
        setData((olddata) => olddata.filter((team) => team.id != teamId));
      } else {
        const text = await res.text();
        errorToast("failed to remove team from quiz", { message: text });
      }
    } catch (e: any) {
      errorToast("Failed to Remove Team", e);
    }
  };

  return (
    <div>
      <AdminNav
        backHref={"/admin/quizs"}
        path={[
          { label: "Admin", href: "/admin" },
          { label: "Quizzes", href: "/admin/quizs" },
          { label: "Teams" },
          // { label: "Members" }
        ]}
      />
      <div className="w-full min-h-screen flex justify-center pb-5">
        {loading ? (
          "Loading"
        ) : (
          <DataTable onCreate={onCreate} columns={columns} data={data} />
        )}
      </div>
    </div>
  );
}
