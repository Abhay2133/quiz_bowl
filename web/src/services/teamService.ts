export const fetchAllTeams = () =>
  fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/teams").then((res) =>
    res.json()
  );
