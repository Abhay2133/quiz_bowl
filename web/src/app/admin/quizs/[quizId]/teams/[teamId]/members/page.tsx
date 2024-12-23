"use client";
import { useEffect, useState } from "react";
import { Team, columns } from "./columns"
import { DataTable } from "./data-table"
import AdminNav from "@/components/admin-navbar";
import { formatISODate } from "@/util/datetime";

export default function TestsPage({ params }: any) {
  const { teamId, quizId } = params;
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/users/team/" + teamId, {headers:{Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,}})
      .then(res => res.json())
      .then((newdata: Team[]) => [setData(newdata.map((dataitem: Team) => ({
        ...dataitem,
        createdAt: formatISODate(dataitem.createdAt),
        updatedAt: formatISODate(dataitem.updatedAt),
      }))),
      setLoading(false)])
      .catch(console.error)
  }, []);

  return (
    <div>
      <AdminNav backHref={`/admin/quizs/${quizId}/teams`} 
      path={[
        { label: "Admin", href: "/admin" },
        { label: "Quizzes", href: "/admin/quizs" },
        { label: "Teams", href: `/admin/quizs/${quizId}/teams` },
        { label: "Members" }
      ]} 
      />
      <div className="w-full min-h-screen flex justify-center pb-5">
        {loading ? "Loading" : <DataTable columns={columns} data={data} />}
      </div>
    </div>
  )
}