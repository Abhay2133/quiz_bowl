import { LiveQuiz } from "@/app/admin/live/columns";
import { getJwtToken } from "./authService";

export const getAllLiveQuizzes = () =>
  fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/liveQuizzes", {
    headers: { Authorization: `Bearer ${getJwtToken()}` },
  }).then((res) => res.json());

export const fetchLiveQuizById = (id: number) =>
  fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/liveQuizzes/" + id, {
    headers: { Authorization: `Bearer ${getJwtToken()}` },
  }).then((res) => res.json());

export const udpateLiveQuizById = (id: number, data: Partial<LiveQuiz>) =>
  fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/liveQuizzes/" + id, {
    method:"put",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${getJwtToken()}`,
    },
  });
