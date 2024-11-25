// app/context/QuizContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type QuestionType = "TEXT" | "IMAGE" | "VIDEO" | "AUDIO";

type Question = {
  id: number;
  index: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  type: QuestionType;
  link: string | null;
  answered: boolean;
  selectedAnswer: string;
};

type User = {
  id: number;
  name: string;
  email: string;
};

type Quiz = {
  id: number;
  name: string;
  quizcode: string;
  // duration: string;
  // timing: string;
  // date: string;
  liveQuizcode: string;
  status: string;
  timeLimit: number;
  positiveScore: number;
  negativeScore: number;
};

type Team = {
  id: number;
  name: string;
  // user1: string;
  // user2: string;
};

export type QuizContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  team: Team;
  setTeam: React.Dispatch<React.SetStateAction<Team>>;
  quiz: Quiz;
  setQuiz: React.Dispatch<React.SetStateAction<Quiz>>;
  question: Question;
  setQuestion: React.Dispatch<React.SetStateAction<Question>>;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  // USER
  const [user, setUser] = useState<User>({
    // id: 32,
    id: 0,
    name: "",
    // email: "demo-email-1@mail.com",
    email: "",
  });

  // QuiZ
  const [quiz, setQuiz] = useState<Quiz>({
    id: 0,
    name: "",
    quizcode: "",
    // duration: "",
    // timing: "",
    // date: "",
    liveQuizcode: "",
    status: "",
    timeLimit: 20, // in seconds
    positiveScore: 1,
    negativeScore: 0,
  });

  // TEAM
  const [team, setTeam] = useState<Team>({
    id: 0,
    name: "",
    // user1: "",
    // user2: "",
  });
  const [question, setQuestion] = useState<Question>({
    id: 0,
    index: 1,
    question: "Default Question",
    option1: "Option1",
    option2: "Option2",
    option3: "Option3",
    option4: "Option4",
    type: "TEXT",
    link: null,
    answered: false,
    selectedAnswer: "",
  });

  return (
    <QuizContext.Provider
      value={{
        user,
        setUser,
        quiz,
        setQuiz,
        team,
        setTeam,
        question,
        setQuestion,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuizContext must be used within a QuizProvider");
  }
  return context;
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
