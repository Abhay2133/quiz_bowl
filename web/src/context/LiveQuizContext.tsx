// app/context/QuizContext.tsx
"use client";

import { udpateLiveQuizById } from "@/services/liveQuizService";
import { errorToast } from "@/util/errors";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";

export type QuestionType = "TEXT" | "IMAGE" | "VIDEO" | "AUDIO";
export type Question = {
  id: number;
  link: string;
  type: QuestionType; // Add more types if applicable
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  question: string;
};
export type QuizData = {
  rounds: {
    id: number;
    name: string;
    questions: Question[];
  }[];
  quizcode: string;
};

export type STATUS = "NOT_STARTED" | "ACTIVE" | "FINISHED";

export type LiveQuiz = {
  id: number;
  quizData: QuizData;
  name: string;
  liveQuizcode: string;
  activeRoundIndex: number;
  activeQuestionIndex: number;
  isAnswerAllowed: boolean;
  status: STATUS;
  timeLimit: number; // in seconds
  quizId: number;
  positiveScore: number;
  negativeScore: number;
  createdAt: string;
  updatedAt: string;

  // roundIndexToUpdate: number;
  // questionIndexToUpdate: number;
};

export type QuizContextType = {
  liveQuiz: LiveQuiz;
  setLiveQuiz: React.Dispatch<React.SetStateAction<LiveQuiz>>;
  setRound: (index: number, cb?: any) => void;
  setQuestion: (index: number, cb?: any) => void;
  setAnswerAccess: (val: boolean, cb?: any) => void;
};

const LiveQuizContext = createContext<QuizContextType | undefined>(undefined);

export const LiveQuizProvider = ({ children }: { children: ReactNode }) => {
  const [liveQuiz, setLiveQuiz] = useState<LiveQuiz>({
    id: 0,
    name: "Default LIve Quiz",
    liveQuizcode: "live-demo-quiz-2024",
    quizData: demoQuizData,
    activeRoundIndex: 0,
    activeQuestionIndex: 0,
    isAnswerAllowed: false,
    status: "NOT_STARTED",
    timeLimit: 0,
    quizId: 2,
    positiveScore: 2,
    negativeScore: 1,
    createdAt: "2024-11-24T07:01:24.634Z",
    updatedAt: "2024-11-24T07:01:24.634Z",

    // roundIndexToUpdate: -1,
    // questionIndexToUpdate: -1,
  });

  const router = useRouter();
  const setRound = async (roundIndex: number, cb?: any) => {
    if (roundIndex < 0 || roundIndex >= liveQuiz.quizData.rounds.length)
      return toast(`Index out of range (${roundIndex})`);

    const updates = {
      activeQuestionIndex: -1,
      activeRoundIndex: roundIndex,
      status: "ACTIVE" as STATUS,
    };
    try {
      const res = await udpateLiveQuizById(liveQuiz.id, updates);
      if (res.status < 400) {
        setLiveQuiz((old) => ({ ...old, ...updates }));
        // router.push(`/admin/live/${liveQuiz.id}/round/${roundIndex}`);
      } else {
        const e = await res.text();
        errorToast("Failed to start Round", e);
      }
    } catch (e: any) {
      errorToast("Failed to update Round", e);
    } finally {
      if (cb) cb();
    }
  };

  const setQuestion = async (questionIndex: number, cb?: any) => {
    const inRange =
      questionIndex < 0 ||
      questionIndex >=
        liveQuiz.quizData.rounds[liveQuiz.activeRoundIndex].questions.length;
    if (inRange) return toast(`question index out of bound (${questionIndex})`);
    try {
      const res = await udpateLiveQuizById(liveQuiz.id, {
        status: "ACTIVE",
        activeQuestionIndex: questionIndex,
      });
      if (res.status < 400) {
        setLiveQuiz((old) => ({ ...old, activeQuestionIndex: questionIndex }));
      } else {
        const message = await res.text();
        errorToast(`Failed to set Qestion (${questionIndex})`, { message });
      }
    } catch (e: any) {
      errorToast(`Failed to set Qestion (${questionIndex})`, e);
    } finally {
      if (cb) cb();
    }
  };

  const setAnswerAccess = async (val: boolean, cb?: any) => {
    const updates = {
      status: "ACTIVE" as STATUS,
      isAnswerAllowed: val,
    };
    try {
      const res = await udpateLiveQuizById(liveQuiz.id, updates);
      if (res.status < 400) {
        setLiveQuiz((old) => ({ ...old, ...updates }));
      } else {
        const message = await res.text();
        errorToast(`failed to change answer acess`, { message });
      }
    } catch (e: any) {
      errorToast(`failed to change answer acess`, e);
    } finally {
      if (cb) cb();
    }
  };

  return (
    <LiveQuizContext.Provider
      value={{
        liveQuiz,
        setLiveQuiz,
        setRound,
        setQuestion,
        setAnswerAccess,
      }}
    >
      {children}
    </LiveQuizContext.Provider>
  );
};

export const useLiveQuiz = () => {
  const context = useContext(LiveQuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};

const questions: Question[] = Array.from([
  {
    id: 317,
    link: "",
    type: "TEXT" as QuestionType,
    option1: "Hooman",
    option2: "Student",
    option3: "Pervert",
    option4: "All of These",
    question: "Who is Yogesh",
  },
  {
    id: 316,
    link: "",
    type: "IMAGE" as QuestionType,
    option1: "React Developer",
    option2: "Python Developer",
    option3: "Hooman",
    option4: "None",
    question: "Who is Abhay Bisht ?",
  },
]);
const demoQuizData = {
  rounds: [
    {
      id: 4,
      name: "Demo Quiz Round 1",
      questions: [
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
        ...questions,
      ],
      // questions,
    },
  ],
  quizcode: "demo-quiz-2024",
};
