"use client";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Question, QuestionType, useLiveQuiz } from "@/context/LiveQuizContext";
import { cn } from "@/lib/utils";
import { fetchLiveQuizById } from "@/services/liveQuizService";
import { errorToast } from "@/util/errors";
import { isValidTime } from "@/util/validators";
import { ArrowLeft, HomeIcon, TimerIcon, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RoundQuestionsPage({ params }: any) {
  const { liveQuizId, roundId } = params;
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

  const router = useRouter();
  const activeRoundId = liveQuiz.quizData.rounds[liveQuiz.activeRoundIndex].id;
  return (
    <div className="">
      {parseInt(roundId) !== activeRoundId ? (
        <div className="h-screen w-full flex flex-col justify-center gap-3 items-center">
          <div className="flex gap-3">
            Round Not Started Yet
            <TriangleAlert size={20} />
          </div>
          <Button
            variant={"outline"}
            onClick={() => router.replace(`/admin/live`)}
          >
            <HomeIcon size={20} />
          </Button>
        </div>
      ) : (
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-screen w-full"
        >
          <ResizablePanel defaultSize={20}>
            <SidePanel />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={80}>
            <QuestionPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}

function SidePanel() {
  const { liveQuiz, setQuestion } = useLiveQuiz();
  if (!liveQuiz.id) return <></>;
  const round = liveQuiz.quizData.rounds[liveQuiz.activeRoundIndex];
  return (
    <div className="flex gap-3 flex-col h-screen py-3">
      {/* Header */}
      <div className="flex gap-5 p-3 px-5 items-center">
        <Link
          href={`/admin/live/${liveQuiz.id}`}
          className="rounded-full hover:bg-secondary border p-3"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>{round.name}</div>
      </div>
      <div className="px-5">Questions</div>
      {/* Indices */}
      <div className="flex-1 pl-5 overflow-auto flex flex-col">
        <div className="flex gap-3 py-1 px-5 flex-wrap">
          {round.questions.map((q, i) => (
            <div
              onClick={() => setQuestion(i)}
              className={cn(
                liveQuiz.quizData.rounds[liveQuiz.activeRoundIndex].id ==
                  round.id && liveQuiz.activeQuestionIndex == i
                  ? "ring-4"
                  : "",
                "hover:bg-secondary cursor-pointer rounded-full w-[40px] h-[40px] flex justify-center items-center border"
              )}
              key={i}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-end gap-3 px-5">
        <Button variant={"outline"}>Previous</Button>
        <Button variant={"outline"}>Next</Button>
      </div>
    </div>
  );
}

function QuestionPanel() {
  const { liveQuiz } = useLiveQuiz();
  return (
    <div className="flex-1 flex flex-col h-screen">
      <Timer />
      <div className="flex-1">
        <QuestionUI />
      </div>
      <Controls />
    </div>
  );
}

const QuestionPlaceholder = () => {
  return (
    <div className="flex min-w-full min-h-full justify-center items-center">
      Select a Question from the Indices
    </div>
  );
};

function QuestionUI() {
  const { liveQuiz } = useLiveQuiz();

  if (liveQuiz.activeQuestionIndex < 0) return <QuestionPlaceholder />;

  const question =
    liveQuiz.quizData.rounds[liveQuiz.activeRoundIndex].questions[
      liveQuiz.activeQuestionIndex
    ];

  return (
    <div className="flex gap-5 bg-primary-foreground m-5 rounded-xl border shadow-lg p-5">
      <div className=" flex-1 flex flex-col  gap-5  ">
        <div className=" opacity-50">
          Question : {liveQuiz.activeQuestionIndex + 1}{" "}
        </div>
        <div className="text-lg">{question.question}</div>
        <div>Options</div>
        <div className="flex flex-col gap-3 ">
          <div className="flex gap-3">
            <Option
              text={`1. ${question.option1}`}
              isAnswer={question.showAnswer && question.answer == "OPTION1"}
            />
            <Option
              text={`2. ${question.option2}`}
              isAnswer={question.showAnswer && question.answer == "OPTION2"}
            />
          </div>
          <div className="flex gap-3">
            <Option
              text={`3. ${question.option3}`}
              isAnswer={question.showAnswer && question.answer == "OPTION3"}
            />
            <Option
              text={`4. ${question.option4}`}
              isAnswer={question.showAnswer && question.answer == "OPTION4"}
            />
          </div>
        </div>
      </div>
      {question.type !== "TEXT" && (
        <Media type={question.type} link={question.link} />
      )}
    </div>
  );
}

function Media({ type, link }: { type: QuestionType; link: string }) {
  let ui = <></>;
  switch (type) {
    case "IMAGE":
      ui = (
        <img
          className="max-h-[400px] max-w-[500px] rounded-xl"
          src={link}
        ></img>
      );
      break;
    case "AUDIO":
      ui = (
        <audio controls>
          <source src={link} />
        </audio>
      );
      break;
    case "VIDEO":
      ui = (
        <video width="640" height="360" controls>
          <source src="video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
  }

  return ui;
}

function Option({ text, isAnswer }: { text: string; isAnswer?: boolean }) {
  return (
    <div
      className={`${
        isAnswer ? "ring-4" : ""
      } flex items-center flex-1 border rounded-full  min-h-[40px] py-1 px-5 text-base`}
    >
      {text}
    </div>
  );
}

function Timer() {
  const { liveQuiz, setLiveQuiz, setAnswerAccess } = useLiveQuiz();
  const [seconds, setSeconds] = useState(liveQuiz.timeLimit);

  useEffect(() => {
    let timer: any;
    if (liveQuiz.isTimerStarted) {
      // if (timer) clearInterval(timer);
      setSeconds(() => liveQuiz.timeLimit);
      timer = setInterval(() => {
        setSeconds((seconds) => {
          if (seconds > 0) {
            return seconds - 1;
          } else {
            clearInterval(timer);
            setAnswerAccess(false);
            return liveQuiz.timeLimit;
          }
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [liveQuiz.isTimerStarted]);
  return (
    <div className="flex w-[200px] justify-center gap-5 mx-auto mt-5 rounded-full px-5 py-2 border shadow-md">
      <TimerIcon size={20} /> {seconds} secs
    </div>
  );
}
// let timer: any;

function Controls() {
  const {
    setAnswerAccess,
    liveQuiz: { isAnswerAllowed },
    setLiveQuiz,
  } = useLiveQuiz();
  const [allowClicked, setAllowClicked] = useState(false);
  const [closeClicked, setCloseClicked] = useState(false);

  const _onAllowClicked = (e: any) => {
    setAllowClicked(true);
    setAnswerAccess(true, () => setAllowClicked(false));
    // setLiveQuiz((old)=>)
  };

  const _onCloseClicked = (e: any) => {
    setCloseClicked(true);
    setAnswerAccess(false, () => setCloseClicked(false));
  };

  const AllowButton = () => (
    <Button
      onClick={_onAllowClicked}
      {...(allowClicked ? { disabled: true } : {})}
    >
      {allowClicked ? "Starting Timer" : "Allow Answers"}
    </Button>
  );

  const CloseButton = () => (
    <Button
      variant={"destructive"}
      onClick={_onCloseClicked}
      {...(closeClicked ? { disabled: true } : {})}
    >
      {closeClicked ? "Stoping Timer" : "Close Answers"}
    </Button>
  );

  const _showAnswer = () => {
    setLiveQuiz((old) => {
      const { activeQuestionIndex, activeRoundIndex } = old;
      old.quizData.rounds[activeRoundIndex].questions[
        activeQuestionIndex
      ].showAnswer = !Boolean(
        old.quizData.rounds[activeRoundIndex].questions[activeQuestionIndex]
          .showAnswer
      );
      // return {...old};
      return JSON.parse(JSON.stringify(old));
    });
  };

  return (
    <div className="border-t border flex p-5 justify-between">
      <div>{isAnswerAllowed ? <CloseButton /> : <AllowButton />}</div>
      <div>
        <Button onClick={_showAnswer}>Show Answer</Button>
      </div>
    </div>
  );
}
