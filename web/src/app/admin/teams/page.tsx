"use client";
import { useEffect, useState } from "react";
import { Team, columns } from "./columns"
import { DataTable } from "./data-table"
import AdminNav from "@/components/admin-navbar";
import { formatISODate } from "@/util/datetime";

export default function TestsPage({ params }: any) {
  const { testId } = params;
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/teams")
      .then(res => res.json())
      .then((newdata: Team[]) => [setData(newdata.map((dataitem: Team) => ({
        ...dataitem,
        createdAt: formatISODate(dataitem.createdAt),
        updatedAt: formatISODate(dataitem.updatedAt),
      }))),
      setLoading(false)])
  }, []);

  return (
    <div>
      <AdminNav backHref={'/admin'} 
      path={[
        { label: "Admin", href: "/admin" },
        { label: "Teams", href: "/admin/teams" },
      ]} 
      />
      <div className="w-full h-screen flex justify-center">
        {loading ? "Loading" : <DataTable columns={columns} data={data} />}
      </div>
    </div>
  )
}