"use client";
import { useEffect, useState } from "react";
import { Question, columns } from "./columns"
import { DataTable } from "./data-table"
import AdminNav from "@/components/admin-navbar";
import { formatISODate } from "@/util/datetime";
import { useRouter } from "next/navigation";

export default function TestsPage({ params }: any) {
  const { quizId, roundId } = params;
  const [data, setData] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const router = useRouter();

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/questions/round/" + roundId)
      .then(res => res.json())
      .then((newdata: Question[]) => [setData(newdata.map((dataitem: Question) => ({
        ...dataitem,
        createdAt: formatISODate(dataitem.createdAt),
        updatedAt: formatISODate(dataitem.updatedAt),
        quizId : quizId
      }))),
      setLoading(false)])
  }, []);

  return (
    <div>
      <AdminNav backHref={`/admin/quizs/${quizId}/rounds`}
        path={[
          { label: "Admin", href: "/admin" },
          { label: "Tests", href: "/admin/quizs" },
          { label: "Rounds", href: `/admin/quizs/${quizId}/rounds` },
          { label: "Questions"},
        ]}
      />
      <div className="w-full min-h-screen flex justify-center pb-5">
        {loading ? "Loading" : <DataTable columns={columns} data={data} />}
      </div>
    </div>
  )
}