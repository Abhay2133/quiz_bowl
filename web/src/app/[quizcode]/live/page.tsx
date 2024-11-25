"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { QuestionType } from "@/app/admin/quizs/[quizId]/submissions/form";
import Header from "@/components/header";
import { useQuiz } from "@/context/QuizContext";
import {
  getQuizInfo,
  getQuizQuestion,
  loadQuizInfo,
  submitLiveAnswer,
} from "@/services/quizService";
import { errorToast } from "@/util/errors";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon, RefreshCcw } from "lucide-react";

export default function LiveQuiz() {
  const ctx = useQuiz();
  const { setQuestion } = ctx;
  const router = useRouter();
  useEffect(() => {
    // loadInfo();
    // _loadQueston();
    _onRefresh();
  }, []);

  const [isRefreshing, setRefreshing] = useState(true);

  // REFRESH
  const _onRefresh = async () => {
    setRefreshing(true);
    await _loadQueston();
    setRefreshing(false);
  };

  // LOAD QUESTOIN
  const _loadQueston = async (cb?: any) => {
    if (!ctx.user.email) return router.replace("/");

    // (does not include in pro) remove after dev ---------------------------------------------------------------------------------------
    if (process.env.NEXT_PUBLIC_ENV == "dev") await loadQuizInfo(ctx, router);

    try {
      const res = await getQuizQuestion(ctx.quiz.id, ctx.user.id);
      if (res.status < 400) {
        const question = await res.json();
        setQuestion({ ...question });
      } else {
        const e = { message: await res.text() };
        errorToast("Failed to Load Question", e);
      }
    } catch (e) {
      errorToast("Failed to Load Question", e);
    } finally {
      if (cb) cb();
    }
  };

  return (
    <div>
      {/* <Data /> */}
      <Header />
      {isRefreshing ? (
        <div className="mx-auto my-32 text-center">
          <Loader2Icon size={40} className="animate-spin mx-auto my-5" />
          Do not refresh the page
        </div>
      ) : (
        <Question />
      )}
      <Refresh isRefreshing={isRefreshing} onRefresh={_onRefresh} />
    </div>
  );
}

function Refresh({
  isRefreshing,
  onRefresh,
}: {
  isRefreshing: boolean;
  onRefresh: any;
}) {
  // const [isRefreshing, setRefreshing] = useState(false);

  return (
    <div className="text-center p-5">
      {isRefreshing ? (
        <Button variant="outline" disabled>
          Refreshing
        </Button>
      ) : (
        <Button
          onClick={onRefresh}
          variant={"outline"}
          className="active:scale-90 transition-transform"
        >
          <RefreshCcw />
          Refresh
        </Button>
      )}
    </div>
  );
}

function Data() {
  const { user, team, quiz, setQuiz, setTeam, setUser } = useQuiz();

  return (
    <div>
      <code>{JSON.stringify(user)}</code>
      <br />
      <code>{JSON.stringify(team)}</code>
      <br />
      <code>{JSON.stringify(quiz)}</code>
    </div>
  );
}

function Question() {
  const ctx = useQuiz();
  const { question, setQuestion } = ctx;
  const [isSubmitting, setSubmitting] = useState(false);

  const _onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!question.selectedAnswer) {
      return errorToast("Failed to Submit Answer", {
        message: `No answer selected`,
      });
    }
    setSubmitting(true);
    const {
      quiz: { id: liveQuizId },
      user: { id: userId },
      question: { selectedAnswer: answer, id: questionId },
      team: { id: teamId },
    } = ctx;
    try {
      const res = await submitLiveAnswer(
        liveQuizId,
        userId,
        questionId,
        answer,
        teamId
      );

      if (res.status < 400) {
        setQuestion((old) => ({ ...old, answered: true }));
      } else {
        const e = await res.json();
        errorToast(`Unable to sumbit answer`, e);
      }
    } catch (e: any) {
      errorToast(`Failed to submit Answer`, e);
    } finally {
      setSubmitting(false);
    }
  };

  const _onAnswerSelected = (val: string) => {
    setQuestion((old) => ({ ...old, selectedAnswer: val }));
  };

  const _reset = () => {
    setQuestion((old) => ({ ...old, selectedAnswer: "" }));
  };

  return (
    <form
      onSubmit={_onSubmit}
      className="flex flex-col gap-3 mx-3 p-5 rounded border border-secondary shadow-md bg-primary-foreground max-w-[500px] md:mx-auto"
    >
      <div className=" opacity-50">Question : {question.index}</div>
      <div>{question.question}</div>
      <div>
        <QuestionMedia type={question.type} link={question.link || ""} />
      </div>
      <div className="text-sm">Options </div>
      <RadioGroup
        // defaultValue={question.selectedAnswer}
        value={question.selectedAnswer}
        className="flex flex-col gap-y-5"
        onValueChange={_onAnswerSelected}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="OPTION1" id="option1" />
          <Label htmlFor="option1">{question.option1}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="OPTION2" id="option2" />
          <Label htmlFor="option2">{question.option2}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="OPTION3" id="option3" />
          <Label htmlFor="option3">{question.option3}</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="OPTION4" id="option4" />
          <Label htmlFor="option4">{question.option4}</Label>
        </div>
      </RadioGroup>
      <div className="flex justify-between mt-3">
        <Button type="reset" variant={"outline"} onClick={() => _reset()}>
          Reset
        </Button>
        {/* <button type="reset">Reset</button> */}
        <SubmitButton
          onSubmit={_onSubmit}
          isSubmitting={isSubmitting}
          isAnswered={question.answered}
        />
      </div>
    </form>
  );
}

function SubmitButton({
  isSubmitting,
  isAnswered,
  onSubmit,
}: {
  onSubmit: any;
  isSubmitting: boolean;
  isAnswered: boolean;
}) {
  if (isAnswered)
    return (
      <Button variant={"outline"} disabled>
        Answered
      </Button>
    );
  return isSubmitting ? (
    <Button type="submit" disabled>
      Submitting
    </Button>
  ) : (
    <Button type="submit" onClick={onSubmit}>
      Submit Answer
    </Button>
  );
}

function QuestionMedia({ type, link }: { type: QuestionType; link?: string }) {
  let ui = <></>;
  switch (type) {
    case "IMAGE":
      ui = <img src={link} className="max-h-[300px] max-w-full" />;
      break;
    case "AUDIO":
      ui = (
        <audio controls>
          <source src={link} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      );
      break;
    case "VIDEO":
      <video width="640" height="360" controls>
        <source src={link} type="video/mp4" />
        Your browser does not support the video tag.
      </video>;
      break;
  }
  return ui;
}
