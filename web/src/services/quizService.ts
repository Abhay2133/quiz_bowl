export const getQuizInfo = (email: string, quizcode: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/quizInfo`, {
    method: "POST",
    body: JSON.stringify({ email, quizcode }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    },
  });
};

// export const submitLiveAnswer = (second) => {third}