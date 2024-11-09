import { PrismaClient, Difficulty, QuestionType, ANSWER } from '@prisma/client';

const prisma = new PrismaClient();

export async function mainSeed() {
  // Create one quiz
  const quiz = await prisma.quiz.create({
    data: {
      name: 'Sample Test',
      quizcode: 'TEST123',
      duration: 120, // 2 hours
      startTiming: new Date('2024-11-10T09:00:00Z'),
      date: new Date('2024-11-10T09:00:00Z'),
      rounds: {
        create: [
          {
            name: 'Screening',
            easyQ: 20,
            mediumQ: 20,
            hardQ: 20,
            questions: {
              create: generateQuestions(20, Difficulty.EASY),
            },
          },
          {
            name: 'Pre-final',
            easyQ: 20,
            mediumQ: 20,
            hardQ: 20,
            questions: {
              create: generateQuestions(20, Difficulty.MEDIUM),
            },
          },
          {
            name: 'Final',
            easyQ: 20,
            mediumQ: 20,
            hardQ: 20,
            questions: {
              create: generateQuestions(20, Difficulty.HARD),
            },
          },
        ],
      },
    },
  });

  // Create 20 teams with 2 users each
  for (let i = 1; i <= 20; i++) {
    const team = await prisma.team.create({
      data: {
        name: `Team ${i}`,
        quizId: quiz.id,
        users: {
          create: [
            { name: `User ${2 * i - 1}`, email: `user${2 * i - 1}@example.com` },
            { name: `User ${2 * i}`, email: `user${2 * i}@example.com` },
          ],
        },
      },
    });
  }

  console.log('Database seeded successfully!');
}

// Function to generate questions for each round
function generateQuestions(count: number, difficulty: Difficulty) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      question: `Question ${i + 1} (${difficulty})`,
      answer: ANSWER.OPTION1, // Example answer
      option1: `Option 1 for Question ${i + 1}`,
      option2: `Option 2 for Question ${i + 1}`,
      option3: `Option 3 for Question ${i + 1}`,
      option4: `Option 4 for Question ${i + 1}`,
      type: QuestionType.TEXT,
      difficulty: difficulty,
    });
  }
  return questions;
}

// Run the seeding function
// main()
//   .catch(e => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
