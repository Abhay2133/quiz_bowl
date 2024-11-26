// import Image from "next/image";
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuiz } from "@/context/QuizContext";
import { userLogin } from "@/services/authService";
import { errorToast } from "@/util/errors";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [email, setEmail] = useState("");
  const [quizcode, setQuizcode] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [isLogined, setLogined] = useState(false);
  const router = useRouter();
  const { setUser, setQuiz } = useQuiz();

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (email.trim().length == 0) return toast(`email cannot be empty`);
    if (quizcode.trim().length == 0) return toast(`quizcode cannot be empty`);

    setSubmitting(true);
    try {
      const res = await userLogin(email, quizcode);
      if (res.status < 400) {
        const { token } = await res.json();
        localStorage.setItem("jwtToken", token);
        setUser((user) => ({ ...user, email }));
        setQuiz((old) => ({ ...old, quizcode }));
        setLogined(true);
        // goto /[quizcode]
        router.replace("/" + quizcode);
      } else {
        const error = await res.json();
        errorToast(`Failed to Login`,  error);
      }
    } catch (e: any) {
      errorToast("failed to login :- " + e.message, e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen min-w-full">
      {/* Header */}
      <div className="p-4 text-center space-y-3">
        <h1 className="text-3xl text-primary">Quiz Bowl Challenge</h1>
        <h2 className="">FESTLA 6.0 - 2024</h2>
      </div>

      <form
        onSubmit={onSubmit}
        className="md:px-10 border-secondary border shadow-md px-8 max-w-[400px] mx-3 md:mx-auto p-3 pb-8 rounded-xl bg-primary-foreground"
      >
        <h2 className="text-center my-5 text-xl">Participant Login</h2>

        <label htmlFor="email">User Email</label>
        <Input
          className="mt-2"
          id="email"
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          required
        />

        <label htmlFor="quizcode" className="block mt-3">
          Quiz Code
        </label>
        <Input
          className="mt-2"
          onChange={(e) => setQuizcode(e.target.value)}
          id="quizcode"
          name="quizcode"
          type="text"
          placeholder="xxx-yyy"
          required
        />
        {isLogined ? <Button className="mt-3" disabled>Login Successfull</Button>:<Button className="mt-3" {...(isSubmitting ? { disabled: true } : {})}>
          {isSubmitting ? "Logging in" : "Login"}
        </Button>}
      </form>
    </div>
  );
}
