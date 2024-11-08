import { Metadata } from "next";
import { PropsWithChildren } from "react";

export default function Layout({children}:PropsWithChildren) {
  return <>{children}</>
}

export const metadata: Metadata = {
  title: "Quiz Bowl | ADMIN",
  description: "AMDIN | Quiz Bowl | FESTlA 6.0",
};
