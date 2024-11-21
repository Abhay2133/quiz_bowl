"use client";
import { useEffect, useState } from "react";
import { Team, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import AdminNav from "@/components/admin-navbar";
import { formatISODate } from "@/util/datetime";
import { createTeam, deleteTeam, fetchAllTeams } from "@/services/teamService";
import ConfirmDialog from "@/components/confirm-dialog";
import { RowModel } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { errorToast } from "@/util/errors";
import { TeamForm } from "./form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const defaultFormData: any = {
  name: "demo-team",
  user1name: "demo-user-1",
  user2name: "demo-user-2",
  user1email: "demo-email-1@mail.com",
  user2email: "demo-email-2@mail.com",
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
    defaultData: any;
  }>({
    open: false,
    variant: "create",
    id: -1,
    defaultData: { ...defaultFormData },
  });
  const [delDialog, setDelDialog] = useState({
    name: "",
    id: -1,
    open: false,
  });

  const loadData = () => {
    fetchAllTeams()
      .then((teams) => {
        setData(
          teams.map((team: Team) => ({
            ...team,
            delete: () => onDelete(team.id, teams),
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

  const onCreate = () => {
    // alert("HEHE")
    setFormDialog({
      ...formDialog,
      variant: "create",
      open: true,
    });
  };

  const doCreate = async (values: any) => {
    if (!values) return;
    try {
      const res = await createTeam(values);
      if (res.status < 400) {
        toast(`Team (${values.name}) created successfully`);
        loadData();
      } else {
        const { error } = await res.json();
        toast(`failed to create team : ${error}`);
      }
    } catch (e: any) {
      errorToast("error creating team", e);
    } finally {
      setFormDialog({
        ...formDialog,
        open: false,
      });
    }
  };

  const onEdit = (id: number) => {};
  const doEdit = () => {};

  const onDelete = (id: number, data: any) => {
    // console.log(data);
    setDelDialog({
      open: true,
      id,
      name: data.find((item: any) => item.id == id)?.name?.toString() || "",
    });
  };

  const doDelete = async () => {
    try {
      const res = await deleteTeam(delDialog.id);
      if (res.status < 400) {
        toast("Team Deleted Successfully");
      } else {
        const body = await res.text();
        errorToast("Failed to delete Team", { message: body });
      }
    } catch (e: any) {
      errorToast("Failed to Delete Team", e);
    } finally {
      await loadData();
      setDelDialog({
        ...delDialog,
        open: false,
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
          <DataTable columns={columns} data={data} onCreate={onCreate} />
        )}
      </div>

      {/* Form */}
      <Dialog
        open={formDialog.open}
        onOpenChange={(val) => setFormDialog({ ...formDialog, open: val })}
      >
        <DialogContent className="sm:max-w-[425px] w-[90%] mx-auto rounded-lg overflow-y-auto max-h-[95%]">
          <DialogHeader>
            <DialogTitle>
              {formDialog.variant == "create" ? "Create Team" : "Edit Team"}
            </DialogTitle>
          </DialogHeader>
          <TeamForm
            defaultData={formDialog.defaultData}
            handleSubmit={formDialog.variant == "create" ? doCreate : doEdit}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <ConfirmDialog
        title={"Delete Team"}
        body={`Delete team '${delDialog.name}' forever ?`}
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
