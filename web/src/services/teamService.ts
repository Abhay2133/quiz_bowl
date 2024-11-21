import { headers } from "next/headers";

export const fetchAllTeams = () =>
  fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/teams", {
    headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
  }).then((res) => res.json());

export function deleteTeam(id: number): Promise<Response> {
  return fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/teams/" + id, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
  });
}

export const createTeam = async (data: any) =>
  fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/create-team", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

export const addTeamToQuiz = (teamId: number, quizId: number) =>
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/teams/quiz/${quizId}`, {
    method: "POST",
    body: JSON.stringify({ teamId }),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      "content-type": "application/json",
    },
  });

export const removeTeamFromQuiz = (teamId: number, quizId: number) =>
  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/teams/quiz/${quizId}`, {
    method: "DELETE",
    body: JSON.stringify({ teamId }),
    headers: {
      Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      "content-type": "application/json",
    },
  });
