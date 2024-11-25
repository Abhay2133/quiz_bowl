import { QuizContextType } from "@/context/QuizContext";
import { errorToast } from "@/util/errors";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

export const getQuizInfo = (email: string, quizcode: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/liveQuizInfo`, {
    method: "POST",
    body: JSON.stringify({ email, quizcode }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  });
};

export const getQuizQuestion = (liveQuizId: number, userId: number) => {
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/liveQuestion`, {
    method: "POST",
    body: JSON.stringify({ liveQuizId, userId }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  });
};

// export const submitLiveAnswer = (second) => {third}
export const loadQuizInfo = async (
  context: QuizContextType,
  router: AppRouterInstance
) => {
  const { user, quiz, setUser, setQuiz, setTeam } = context;
  if (!user.email) return router.replace("/");
  try {
    const res = await getQuizInfo(user.email, quiz.quizcode);
    if (res.status < 400) {
      const {
        id,
        name,
        liveQuizcode,
        status,
        timeLimit,
        positiveScore,
        negativeScore,
        teamName,
        userName,
        teamId,
        userId,
        // quizcode,
      } = await res.json();

      setUser((old) => ({ ...old, name: userName, id: userId }));
      setQuiz((old) => ({
        ...old,
        id: id,
        // duration,
        // timing,
        // date,
        name: name,
        liveQuizcode,
        status,
        timeLimit,
        positiveScore,
        negativeScore,
      }));
      setTeam((old) => ({
        ...old,
        id: teamId,
        // user1: userName,
        // user2: teammateName,
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
