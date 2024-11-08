"use client";
import { useEffect, useState } from "react";
import { Question, columns } from "./columns"
import { DataTable } from "./data-table"
import AdminNav from "@/components/admin-navbar";
import { formatISODate } from "@/util/datetime";
import { useRouter } from "next/navigation";

export default function TestsPage({ params }: any) {
  const { testId, roundId } = params;
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
        testId : testId
      }))),
      setLoading(false)])
  }, []);

  return (
    <div>
      <AdminNav backHref={`/admin/tests/${testId}/rounds`}
        path={[
          { label: "Admin", href: "/admin" },
          { label: "Tests", href: "/admin/tests" },
          { label: "Rounds", href: `/admin/tests/${testId}/rounds` },
          { label: "Questions"},
        ]}
      />
      <div className="w-full h-screen flex justify-center">
        {loading ? "Loading" : <DataTable columns={columns} data={data} />}
      </div>
    </div>
  )
}