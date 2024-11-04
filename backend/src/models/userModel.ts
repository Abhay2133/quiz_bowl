import prisma from '../utils/prisma';

export const findUserByCredentials = async (username: string, teamName: string, testCode: string) => {
  return await prisma.user.findFirst({
    where: {
      username,
      teamName,
      testCode,
    },
  });
};
