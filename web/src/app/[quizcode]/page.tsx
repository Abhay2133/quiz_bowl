"use client";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuiz } from "@/context/QuizContext";
import { userLogout } from "@/services/authService";
import { getQuizInfo } from "@/services/quizService";
import {
  convertIsoToDate,
  convertIsoToTime,
  formatISODate,
} from "@/util/datetime";
import { errorToast } from "@/util/errors";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function LiveQuiz({ params }: any) {
  const { user, quiz, setUser, setQuiz, setTeam } = useQuiz();
  const { quizcode } = params;
  const router = useRouter();

  const loadInfo = async () => {
    if (!user.email) return router.replace("/");
    try {
      const res = await getQuizInfo(user.email, quiz.quizcode);
      if (res.status < 400) {
        const {
          userName,
          quizId,
          teamName,
          teammateName,
          teamId,
          userId,
          duration,
          timing,
          date,
          quizName,
          // quizcode,
        } = await res.json();

        setUser((old) => ({ ...old, name: userName, id: userId }));
        setQuiz((old) => ({
          ...old,
          id: quizId,
          duration,
          timing,
          date,
          name: quizName,
        }));
        setTeam((old) => ({
          ...old,
          id: teamId,
          user1: userName,
          user2: teammateName,
          name: teamName,
        }));
      } else {
        const message = await res.text();
        errorToast("Failed to load quiz info", { message });
      }
    } catch (e: any) {
      errorToast("Failed to load Quiz Info", e);
    }
  };

  useEffect(() => {
    loadInfo();
  }, []);

  return (
    <div>
      {/* <div>{user.email}</div>
      <div>{quiz.quizcode}</div> */}
      <Header />
      <Info />
    </div>
  );
}

function Info() {
  const { user, team, quiz } = useQuiz();
  const router = useRouter();

  const _logout = () => {
    userLogout();
    router.replace("/");
  };

  const _start = () => {
    router.push(`/${quiz.quizcode}/live`);
  };

  return (
    <section className="max-w-[500px] mx-3 md:mx-auto rounded-xl border shadow-md bg-secondary">
      <h2 className="my-3 px-5">Details</h2>
      <div className="px-5 pb-5 flex flex-col gap-3">
        <Detail title={"Quiz Name"} body={quiz.name} />
        <Detail title={"User Name"} body={user.name} />
        <Detail title={"Team Name"} body={team.name} />
        <Detail
          title={"Duration"}
          body={
            quiz.duration ? (
              quiz.duration + " mins"
            ) : (
              <PlaceHolder width="100px" />
            )
          }
        />
        <Detail
          title={"Timing"}
          body={
            quiz.timing ? (
              convertIsoToTime(quiz.timing)
            ) : (
              <PlaceHolder width="90px" />
            )
          }
        />
        <Detail
          title={"Date"}
          body={
            quiz.timing ? (
              convertIsoToDate(quiz.date)
            ) : (
              <PlaceHolder width="130px" />
            )
          }
        />
      </div>
      <div className="flex gap-3 justify-center pb-5">
        <Button variant={"destructive"} onClick={() => _logout()}>
          Logout
        </Button>
        {/* <Button className="focus:ring-blue-500 focus:border-blue-500">Start Quiz</Button> */}

        {!!user.id && <button
          // type="submit"
          onClick={()=>_start()}
          className="text-white end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Start Quiz
        </button>}
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
