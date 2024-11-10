import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function AdminNav({
  backHref,
  path,
}: {
  backHref: string;
  path: { label: string; href?: string }[];
}) {
  const router = useRouter();

  const BreadCrumbItems: any[] = [];
  for (let i = 0; i < path.length; i++) {
    const { href, label } = path[i];
    if (i < path.length - 1)
      BreadCrumbItems.push(
        <BreadcrumbItem key={i * 2}>
          {href ? <BreadcrumbLink href={href}>{label}</BreadcrumbLink> : label}
        </BreadcrumbItem>
      );
    if (i == path?.length - 1)
      BreadCrumbItems.push(
        <BreadcrumbItem key={2 * i}>
          <BreadcrumbPage>{label}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    if (i < path.length - 1)
      BreadCrumbItems.push(<BreadcrumbSeparator key={2 * i + 1} />);
  }

  return (
    <div className="flex p-5 gap-5 items-center">
      <Link href={backHref}>
        <div
          className="h-[40px] w-[40px] flex items-center justify-center border hover:bg-secondary rounded-full"
          // onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
        </div>
      </Link>
      <div className="mx-auto">
        {/* {path && <Breadcrumb>
        <BreadcrumbList>
          {path?.map(({ label, href }, i) => {
            if (i == path?.length - 1) return (
              <BreadcrumbItem key={i}>
                <BreadcrumbPage>{label}</BreadcrumbPage>
              </BreadcrumbItem>)
            return <>
              <BreadcrumbItem key={i * 2}>
                {href ? <BreadcrumbLink href={href}>{label}</BreadcrumbLink> : label}
              </BreadcrumbItem>
              <BreadcrumbSeparator key={i + 1} />
            </>
          })
          }
        </BreadcrumbList>
      </Breadcrumb>} */}
        <Breadcrumb>
          <BreadcrumbList>{BreadCrumbItems}</BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  );
}
