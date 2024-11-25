"use client";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLiveQuiz } from "@/context/LiveQuizContext";
import { fetchLeaderboard } from "@/services/liveQuizService";
import { errorToast } from "@/util/errors";
import { ArrowLeft, Radio } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function LeaderboardPage({ params }: any) {
  const { liveQuiz } = useLiveQuiz();
  const { liveQuizId } = params;
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<
    { team: string; score: number }[]
  >([]);

  const _loadLeaderboard = async () => {
    try {
      const res = await fetchLeaderboard(parseInt(liveQuizId));
      const data = await res.json();
      if (res.status < 400) {
        setLeaderboard(data);
      } else {
        errorToast(`Unable to lead leaderboard`, data);
      }
    } catch (e) {
      errorToast(`Failed to load Leaderboard`, e);
    }
  };
  useEffect(() => {
    _loadLeaderboard();
  }, []);

  return (
    <div>
      <Header name={liveQuiz.name} backHref={`/admin/live/${liveQuizId}`} />
      {/* <code>{JSON.stringify(leaderboard)}</code> */}
      <Leaderboard data={leaderboard} />
    </div>
  );
}

function BackButton({ href }: { href: string }) {
  return (
    <Link href={href} className="p-3 rounded-full border">
      {" "}
      <ArrowLeft size={20} />
    </Link>
  );
}

function Header({ name, backHref }: { name: string; backHref: string }) {
  return (
    <header className="flex gap-3 p-4  ">
      <div className="flex fle-col items-center">
        <BackButton href={backHref} />
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="text-3xl">Quiz Bowl Challenge</div>
        <div className="">{name}</div>
      </div>
    </header>
  );
}

const Leaderboard = ({ data }: { data: { team: string; score: number }[] }) => {
  return (
    <div className="flex flex-col gap-3 max-w-[500px] mx-auto m-3 rounded-lg border shadow-md p-5">
      <div className="text-2xl font-bold text-center my-4">LEADERBOARD</div>
      {data.map((val, i) => (
        <TeamScore index={i + 1} key={i} team={val.team} score={val.score} />
      ))}
    </div>
  );
};

function TeamScore({
  team,
  score,
  index,
}: {
  index: number;
  team: string;
  score: number;
}) {
  return (
    <div className="text-xl bg-secondary flex justify-between px-5 py-3 rounded border-secondary border shadow">
      <div>
        {index}. {team}
      </div>
      <div>{score}</div>
    </div>
  );
}
