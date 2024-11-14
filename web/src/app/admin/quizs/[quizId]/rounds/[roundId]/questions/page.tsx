"use client";
import { useEffect, useState } from "react";
import { Question, columns } from "./columns";
import { DataTable } from "@/components/data-table";
import AdminNav from "@/components/admin-navbar";
import { formatISODate } from "@/util/datetime";
import { RowModel } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function TestsPage({ params }: any) {
  const { quizId, roundId } = params;
  const [data, setData] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [delManyDialog, setDelManyDialog] = useState({
    open: false,
    ids: Array<number>(),
  });

  const fetchAllData = () => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/questions/round/" + roundId)
      .then((res) => res.json())
      .then((newdata: Question[]) => [
        setData(
          newdata.map((dataitem: Question) => ({
            ...dataitem,
            createdAt: formatISODate(dataitem.createdAt),
            updatedAt: formatISODate(dataitem.updatedAt),
            quizId: quizId,
          }))
        ),
        setLoading(false),
      ]);
  };

  useEffect(fetchAllData, []);

  const onCreateQuestion = () => {

  }

  const onDeleteMany = async ({ rows }: RowModel<any>) => {
    // console.log(rows);
    const ids = rows.map((row) => row.original.id);
    setDelManyDialog({ open: true, ids });
  };

  const doDeleteMany = async () => {
    try {
      const { ids } = delManyDialog;
      const idsSet = new Set(ids);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/questions/delete-many`,
        {
          method: "POST",
          body: JSON.stringify({ ids }),
          headers: { "content-type": "application/json" },
        }
      );
      if (response.status < 400) {
        setData(data.filter((item: any) => !idsSet.has(item.id)));
      } else {
      }
    } catch (e) {
      console.error(e);
      toast("Failed to Delete Many Questions");
    } finally {
      setDelManyDialog({ open: false, ids: [] });
    }
  };

  return (
    <div>
      <AdminNav
        backHref={`/admin/quizs/${quizId}/rounds`}
        path={[
          { label: "Admin", href: "/admin" },
          { label: "Quizzes", href: "/admin/quizs" },
          { label: "Rounds", href: `/admin/quizs/${quizId}/rounds` },
          { label: "Questions" },
        ]}
      />

      {/* Data - Table */}
      <div className="w-full min-h-screen flex justify-center pb-5">
        {loading ? (
          "Loading"
        ) : (
          <DataTable
            columns={columns}
            data={data}
            openCreateDialog={onCreateQuestion}
            onSelectedDelete={onDeleteMany}
          />
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog
        open={delManyDialog.open}
        onOpenChange={(open) => setDelManyDialog({ ...delManyDialog, open })}
      >
        <DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Selected</DialogTitle>
            <DialogDescription>
              Confirm to delete all the selected questions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button type="submit" variant={"outline"}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={"destructive"}
              onClick={doDeleteMany}
            >
              Delete Selected
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
