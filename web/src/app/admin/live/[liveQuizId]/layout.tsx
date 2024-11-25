import { LiveQuizProvider } from "@/context/LiveQuizContext";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <LiveQuizProvider>{children}</LiveQuizProvider>;
}
