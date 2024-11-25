export const userLogin = (email: string, quizcode: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/user`, {
    method: "POST",
    body: JSON.stringify({ email, quizcode }),
    headers: {
      "content-type": "application/json",
      Authorization: `Bearer ${getJwtToken()}`,
    },
  });
};

export const getJwtToken = () => localStorage.getItem("jwtToken")

export const userLogout = () => {
  localStorage.removeItem('jwtToken');
}