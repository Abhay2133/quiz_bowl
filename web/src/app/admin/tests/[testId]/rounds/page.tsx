"use client";
import { useEffect, useState } from "react";
import { Round, columns } from "./columns";
import { DataTable } from "./data-table";
import AdminNav from "@/components/admin-navbar";
import { formatISODate } from "@/util/datetime";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoundForm } from "./form";
import { toast } from "sonner";

export default function TestsPage({ params }: any) {
  const { testId } = params;
  const [data, setData] = useState<Round[]>([]);
  const [loading, setLoading] = useState<string>("Loading ...");

  const [formDialog, setFormDialog] = useState<{
    open: boolean;
    variant: "create" | "update";
    updateId: number;
    defaultData: any;
  }>({
    open: false,
    variant: "create",
    updateId: -1,
    defaultData: {
      name: "",
      order: 0,
      easyQ: 0,
      mediumQ: 0,
      hardQ: 0,
    },
  });

  // get all rounds for current test
  const fetchAllRounds = () => {
    fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/rounds/test/" + testId)
      .then((res) => res.json())
      .then((newdata: Round[]) => {
        setData(
          newdata.map((dataitem: Round) => ({
            ...dataitem,
            startTiming: formatISODate(dataitem.startTiming),
            createdAt: formatISODate(dataitem.createdAt),
            updatedAt: formatISODate(dataitem.updatedAt),
          }))
        );
        setLoading("");
      })
      .catch((e) => {
        setLoading("Error while fetching Rounds");
        console.error(e);
      });
  };

  useEffect(fetchAllRounds, []);

  const handleCreate = async (values: any) => {
    // console.log(values);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/api/rounds",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ ...values, testId: parseInt(testId) }),
        }
      );

      if (res.status < 400) {
        toast("Round created Successfully");
        fetchAllRounds();
      } else {
        const json = await res.json();
        toast("Failed to create Round", {
          action: {
            label: "copy",
            onClick: () =>
              navigator.clipboard.writeText(
                JSON.stringify({ error: "Round Create Error", message: json })
              ),
          },
        });
      }
    } catch (e) {
    } finally {
      setFormDialog({
        open: false,
        variant: "create",
        updateId: -1,
        defaultData: {
          name: "",
          // order: 0,
          easyQ: 0,
          mediumQ: 0,
          hardQ: 0,
        },
      });
    }
  };
  const putUpdate = async () => {};

  const showCreateDialog = () => {
    setFormDialog({
      open: true,
      variant: "create",
      updateId: -1,
      defaultData: {
        name: "",
        // order: 0,
        easyQ: 0,
        mediumQ: 0,
        hardQ: 0,
      },
    });
  };

  return (
    <div>
      <AdminNav
        backHref={"/admin/tests"}
        path={[
          { label: "Admin", href: "/admin" },
          { label: "Tests", href: "/admin/tests" },
          { label: "Rounds", href: `/admin/tests/${testId}/rounds` },
        ]}
      />
      <div className="w-full h-screen flex justify-center">
        {loading ? (
          loading
        ) : (
          <DataTable
            openCreateDialog={showCreateDialog}
            columns={columns}
            data={data}
          />
        )}
      </div>

      {/* Form Dialog */}
      <Dialog
        open={formDialog.open}
        onOpenChange={(val) => setFormDialog({ ...formDialog, open: val })}
      >
        <DialogContent className="sm:max-w-[425px] w-[90%] mx-auto rounded-lg overflow-y-auto max-h-[95%]">
          <DialogHeader>
            <DialogTitle>
              {/* {formDialog.variant == "create" ? "Create Test" : "Edit Test"} */}
            </DialogTitle>
          </DialogHeader>
          <RoundForm
            defaultData={formDialog.defaultData}
            handleSubmit={
              formDialog.variant == "create" ? handleCreate : putUpdate
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
