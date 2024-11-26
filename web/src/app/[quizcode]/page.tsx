"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuiz } from "@/context/QuizContext";
import { userLogout } from "@/services/authService";
import { getQuizInfo, loadQuizInfo } from "@/services/quizService";
import {
  convertIsoToDate,
  convertIsoToTime,
  formatISODate,
} from "@/util/datetime";
import { errorToast } from "@/util/errors";
import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function LiveQuizLogin({ params }: any) {
  const context = useQuiz();
  const { user, quiz, setUser, setQuiz, setTeam } = context;
  const { quizcode } = params;
  const router = useRouter();

  useEffect(() => {
    loadQuizInfo(context, router);
  }, []);

  const _onRefresh = async (cb?: any) => {
    try {
      await loadQuizInfo(context, router);
    } catch (error) {
      errorToast(`Failed to Load quiz data`, error);
    } finally {
      if (cb) cb();
    }
  };

  return (
    <div>
      {/* <div>{user.email}</div>
      <div>{quiz.quizcode}</div> */}
      <Header />
      <Info onRefresh={_onRefresh} />
    </div>
  );
}

function Info({ onRefresh }: { onRefresh: any }) {
  const { user, team, quiz } = useQuiz();
  const router = useRouter();
  const [isRefreshing, setRefreshing] = useState(false);
  const _logout = () => {
    userLogout();
    router.replace("/");
  };

  const _start = () => {
    router.push(`/${quiz.quizcode}/live`);
  };

  const _onRefresh = () => {
    setRefreshing(true);
    onRefresh(() => setRefreshing(false));
  };

  return (
    <section className="max-w-[500px] mx-3 md:mx-auto rounded-xl border shadow-md bg-secondary">
      <h2 className="my-3 px-5">Details</h2>
      <div className="px-5 pb-5 flex flex-col gap-3">
        <Detail title={"Quiz Name"} body={quiz.name} />
        <Detail title={"User Name"} body={user.name} />
        <Detail title={"Team Name"} body={team.name} />
        <Detail title={"Status"} body={quiz.status} />
        <Detail
          title={"Positive Score"}
          body={quiz.positiveScore?.toString()}
        />
        <Detail
          title={"Negative Score"}
          body={quiz.negativeScore?.toString()}
        />
      </div>
      <div className="flex gap-3 justify-center pb-5">
        <Button variant={"destructive"} onClick={() => _logout()}>
          Logout
        </Button>
        {/* <Button className="focus:ring-blue-500 focus:border-blue-500">Start Quiz</Button> */}
        <Button
          variant={"outline"}
          {...(isRefreshing ? { disabled: true } : {})}
          onClick={_onRefresh}
        >
          {isRefreshing ? "Refreshing" : "Refresh"}
        </Button>
        {!!user.id && quiz.status == "ACTIVE" && (
          <button
            // type="submit"
            onClick={() => _start()}
            className="text-white end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Start Quiz
          </button>
        )}
      </div>
    </section>
  );
}

function Detail({ title, body }: { title: string; body: string | ReactNode }) {
  return (
    <div className="flex-col flex gap-1">
      <div className="px-3 text-sm text-muted-foreground">{title}</div>
      <div className="px-3 text-base">
        {body || <PlaceHolder width="110px" />}
      </div>
    </div>
  );
}

function PlaceHolder({ width = "80px" }: { width?: string }) {
  return <Skeleton className="rounded-sm h-5 w-32" style={{ width }} />;
}
