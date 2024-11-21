import { headers } from "next/headers";

export const fetchAllTeams = () =>
  fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/teams", {
    headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
  }).then((res) => res.json());

export function deleteTeam(id: number):Promise<Response> {
  return fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/teams/"+id, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("jwtToken")}` },
  });
}
