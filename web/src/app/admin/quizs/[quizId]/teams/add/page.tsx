"use client";
import { useEffect, useState } from "react";
import { Team, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import AdminNav from "@/components/admin-navbar";
import { formatISODate } from "@/util/datetime";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { errorToast } from "@/util/errors";
import { addTeamToQuiz } from "@/services/teamService";
import { toast } from "sonner";

export default function TestsPage({ params }: any) {
  const { quizId } = params;
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = () => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/teams/not-quiz/" + quizId, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
    })
      .then((res) => res.json())
      .then((newdata: any) => {
        setData(
          newdata.otherTeams.map((dataitem: Team, index: number) => ({
            ...dataitem,
            createdAt: formatISODate(dataitem.createdAt),
            updatedAt: formatISODate(dataitem.updatedAt),
            quizId,
            actionUI: (
              <Button
                onClick={() => onAdd(index, dataitem.id)}
                variant={"outline"}
                className="active:scale-90"
              >
                Add
              </Button>
            ),
          }))
        );
        setLoading(false);
      });
  };
  useEffect(loadData, []);

  const onAdd = async (index: number, teamId: number) => {
    try {
      const res = await addTeamToQuiz(teamId, quizId);
      if (res.status < 400) {
        toast("Team added to quiz");
        setData((olddata) => olddata.filter((item) => item.id != teamId));
      } else {
        const text = await res.text();
        errorToast("Failed to add team", { message: text });
      }
    } catch (e: any) {
      errorToast("Failed to add Team", e);
    }
  };

  const router = useRouter();
  const onCreate = () => {
    router.push("add");
  };

  return (
    <div>
      <AdminNav
        backHref={`/admin/quizs/${quizId}/teams`}
        path={[
          { label: "Admin", href: "/admin" },
          { label: "Quizzes", href: "/admin/quizs" },
          { label: "Teams", href: `/admin/quizs/${quizId}/teams` },
          { label: "Add" },
        ]}
      />
      <div className="w-full min-h-screen flex justify-center pb-5">
        {loading ? "Loading" : <DataTable columns={columns} data={data} />}
      </div>
    </div>
  );
}
