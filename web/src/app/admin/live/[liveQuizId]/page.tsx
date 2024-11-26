"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLiveQuiz } from "@/context/LiveQuizContext";
import { fetchLiveQuizById } from "@/services/liveQuizService";
import { errorToast } from "@/util/errors";
import {
  ArrowLeft,
  ClipboardListIcon,
  EllipsisVertical,
  Eye,
  Loader2Icon,
  LucideHome,
  Radio,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LiveQuizPlayground({ params }: any) {
  const { liveQuizId } = params;

  const { liveQuiz, setLiveQuiz } = useLiveQuiz();

  const _loadData = async () => {
    try {
      const data = await fetchLiveQuizById(parseInt(liveQuizId));
      if (data.error) {
        errorToast("Failed to load liveQuiz", data.error);
        return;
      }
      setLiveQuiz(() => data);
    } catch (e) {
      errorToast("Failed to load live quiz data", e);
    }
  };

  useEffect(() => {
    if (!liveQuiz.id) _loadData();
  }, []);
  return (
    <div>
      <Header
        name={"Demo Testing"}
        leaderboardHref={`/admin/live/${liveQuizId}/leaderboard`}
        backHref={"/admin/live"}
      />
      <Rounds />
    </div>
  );
}

function Rounds() {
  const { liveQuiz } = useLiveQuiz();
  return !liveQuiz.id ? (
    <Loader2Icon size={40} className="mx-auto animate-spin mt-20" />
  ) : (
    <section className=" md:px-20 px-5">
      {/* Header */}
      <h2>Rounds</h2>
      {/* Rounds Contianer */}
      <div className="flex gap-3 justify-start mt-3 flex-wrap">
        {liveQuiz?.quizData?.rounds?.map((round, i) => (
          <Round
            index={i}
            href={`/admin/live/${liveQuiz.id}/round/${round.id}`}
            key={i}
            name={round.name}
            questionsCount={round.questions.length}
            isActive={i == liveQuiz.activeRoundIndex}
          />
        ))}
        {/* <Round name={"Mathematics Quiz"} questionsCount={0} isActive={true} />
        <Round name={"Voice Over Quiz"} questionsCount={0} isActive={true} />
        <Round name={"Tagline Quiz"} questionsCount={0} isActive={true} />
        <Round
          name={"Video Identify Quiz"}
          questionsCount={0}
          isActive={true}
        /> */}
      </div>
    </section>
  );
}

function Round({
  name,
  questionsCount,
  isActive,
  href,
  index,
}: {
  name: string;
  index: number;
  questionsCount: number;
  href: string;
  isActive: boolean;
}) {
  const { setRound, liveQuiz } = useLiveQuiz();
  const [clicked, setClicked] = useState(false);
  const _setRound = () => {
    setClicked(true);
    setRound(index, () => setClicked(false));
  };
  return (
    <div className="border p-4 min-w-[300px] rounded shadow-md bg-primary-foreground">
      <div className="text-xl">{name}</div>
      <div className="opacity-50 m-2">{questionsCount} Questions</div>
      {/* Controls */}
      <div className="flex justify-end">
        {isActive ? (
          <Link
            href={href}
            className="text-base hover:underline underline-offset-4"
          >
            <Button>Open</Button>
          </Link>
        ) : (
          <Button
            {...(clicked ? { disabled: true } : {})}
            className="active:scale-90 transition cursor-pointer"
            variant={"outline"}
            onClick={() => _setRound()}
          >
            {clicked ? "Starting" : "Start"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Header({
  name,
  leaderboardHref,
  backHref,
}: {
  name: string;
  leaderboardHref: string;
  backHref: string;
}) {
  return (
    <header className="flex gap-3 p-4  ">
      <div className="flex fle-col items-center">
        <Link href={backHref} className="rounded-full p-3 border">
          <ArrowLeft size={20} />
        </Link>
      </div>
      <div className="flex-1 flex flex-col items-center">
        <div className="text-3xl">Quiz Bowl Challenge</div>
        <div className="">{name}</div>
      </div>

      <Link className="" href={leaderboardHref}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>
                <ClipboardListIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Leaderboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Link>
    </header>
  );
}
