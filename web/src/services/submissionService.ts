export const fetchSubmissions = () =>
  fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/submissions").then((res) =>
    res.json()
  );

export const updateSubmission = async () =>{}

export const createSubmission = async () =>{}

export const deleteSubmission = async () =>{}