import { Button } from "@/components/ui/button";
import { TextSelectionIcon, Users } from "lucide-react";
import Link from "next/link";



export default function AdminPage() {
  return (
    <>
      <div className="text-2xl py-10 text-center">ADMIN DASHBOARD</div>
      <div className="flex flex-wrap justify-center gap-5 flex-col md:flex-row px-5">
        {/* <Link href={"/admin/tests"} className="flex"><Button>Tests</Button></Link>
        <Link href={"/admin/teams"} className="flex"><Button>Teams</Button></Link> */}
        <LinkCard href="/admin/tests" title="Tests" subtitle="Create and Edit Tests" icon={<TextSelectionIcon size={40} />} />
        <LinkCard href="/admin/teams" title="Teams" subtitle="Create and Manage Teams" icon={<Users size={40} />} />
      </div>
    </>)
}

function LinkCard({ title, href, subtitle, icon }: { title: string, href: string, subtitle: string, icon: any }) {
  return (
    <Link href={href}>
      <div className="flex items-center gap-5 p-5 rounded-lg border min-w-[200px] shadow bg-primary-foreground">
        <div>{icon}</div>
        <div>
          <div className="font-semibold ">{title}</div>
          <div className="text-gray-500">{subtitle}</div>
        </div>
      </div>
    </Link>
  )
}