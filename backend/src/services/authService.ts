import prisma from "../prisma/client"
import { generateToken } from "../utils/jwt";

export const generateLiveUserToken = async (email:string, quizcode:string) => {

  const user = await prisma.user.findUnique({where:{email}});
  if(!user) throw new Error(`User not found`);

  if(!user.teamId) throw new Error(`User is not in any team`);
  const team = await prisma.team.findUnique({where:{id:user.teamId}});
  if(!team) throw new Error(`User's team doesn't exists`);

  const quiz = await prisma.quiz.findUnique({where:{quizcode}});
  if(!quiz) throw new Error(`Quizcode (${quizcode}) invalid`);

  const liveQuiz = await prisma.liveQuiz.findUnique({where:{quizId: quiz.id}});
  if(!liveQuiz) throw new Error(`LiveQuiz doesn't exists for given quiz-code`);

  const token = generateToken({userId:user.id});

  return token;
}