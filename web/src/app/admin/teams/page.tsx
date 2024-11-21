"use client";
import { useEffect, useState } from "react";
import { Team, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import AdminNav from "@/components/admin-navbar";
import { formatISODate } from "@/util/datetime";
import { deleteTeam, fetchAllTeams } from "@/services/teamService";
import ConfirmDialog from "@/components/confirm-dialog";
import { RowModel } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { errorToast } from "@/util/errors";

const defaultFormData = {
  name: "",
};

export default function TestsPage({ params }: any) {
  const { quizId } = params;
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState<string>("Fetching Teams Data ...");
  const [selected, setSelected] = useState<RowModel<any>>();

  const [delManyDialog, setDelManyDialog] = useState({
    open: false,
    ids: Array<number>(),
  });
  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    variant: "create" | "update";
    id: number;
    // defaultData: FormType;
  }>({
    open: false,
    variant: "create",
    id: -1,
    // defaultData: { ...defaultFormData },
  });
  const [delDialog, setDelDialog] = useState({
    // name: "",
    id: -1,
    open: false,
  });

  const loadData = () => {
    fetchAllTeams()
      .then((teams) => {
        setData(
          teams.map((team: Team) => ({
            ...team,
            delete: () => onDelete(team.id),
          }))
        );
        setLoading("");
      })
      .catch((e) => {
        console.error(e);
        setLoading("Error Loading Teams ...");
      });
  };

  useEffect(loadData, []);

  const onCreate = (id: number) => {};
  const doCreate = () => {};

  const onEdit = (id: number) => {};
  const doEdit = () => {};

  const onDelete = (id: number) => {
    setDelDialog({
      open: true,
      id,
    });
  };
  const doDelete = async () => {
    try {
      const res = await deleteTeam(delDialog.id);
      if (res.status < 400) {
        toast("Team Deleted Successfully");
      } else {
        const body = await res.text();
        errorToast("Failed to delete Team", {message: body})
      }
    } catch (e: any) {
      errorToast("Failed to Delete Team", e);
    } finally {
      await loadData();
      setDelDialog({
        open: false,
        id: -1,
      });
    }
  };

  return (
    <div className="pb-5">
      <AdminNav
        backHref={"/admin"}
        path={[
          { label: "Admin", href: "/admin" },
          { label: "Teams", href: "/admin/teams" },
        ]}
      />
      <div className="w-full min-h-screen flex justify-center pb-5">
        {loading ? (
          loading
        ) : (
          <DataTable columns={columns} data={data} onCreate={null} />
        )}
      </div>

      {/* Delete Dialog */}
      <ConfirmDialog
        title={"Delete Team"}
        body={"Deleted team forever"}
        footer={
          <Button variant={"destructive"} onClick={doDelete}>
            Delete Team
          </Button>
        }
        open={delDialog.open}
        onOpenChange={(open: boolean) => setDelDialog({ ...delDialog, open })}
      />
    </div>
  );
}
