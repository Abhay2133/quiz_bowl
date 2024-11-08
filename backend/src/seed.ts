import { PrismaClient, Difficulty, QuestionType, ANSWER } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a test
  const test = await prisma.test.create({
    data: {
      name: 'Sample Test 1',
      testcode: 'TEST1CODE',
      duration: 120, // 2 hours
      startTiming: new Date(),
      date: new Date(),
      rounds: {
        create: [
          {
            name: 'Round 1',
            easyQ: 7,
            mediumQ: 7,
            hardQ: 6,
            questions: {
              create: generateQuestions('Round 1', 7, 7, 6),
            },
          },
          {
            name: 'Round 2',
            easyQ: 6,
            mediumQ: 7,
            hardQ: 7,
            questions: {
              create: generateQuestions('Round 2', 6, 7, 7),
            },
          },
          {
            name: 'Round 3',
            easyQ: 7,
            mediumQ: 6,
            hardQ: 7,
            questions: {
              create: generateQuestions('Round 3', 7, 6, 7),
            },
          },
        ],
      },
    },
  });

  // Output result for confirmation
  console.log('Test created:', test);
}

function generateQuestions(roundName: string, easyCount: number, mediumCount: number, hardCount: number) {
  const questions: any[] = [];
  
  // Easy questions
  for (let i = 0; i < easyCount; i++) {
    questions.push({
      question: `${roundName} - Easy Question ${i + 1}`,
      answer: ANSWER.OPTION1,
      option1: 'Easy Option 1',
      option2: 'Easy Option 2',
      option3: 'Easy Option 3',
      option4: 'Easy Option 4',
      type: QuestionType.TEXT,
      difficulty: Difficulty.EASY,
    });
  }

  // Medium questions
  for (let i = 0; i < mediumCount; i++) {
    questions.push({
      question: `${roundName} - Medium Question ${i + 1}`,
      answer: ANSWER.OPTION2,
      option1: 'Medium Option 1',
      option2: 'Medium Option 2',
      option3: 'Medium Option 3',
      option4: 'Medium Option 4',
      type: QuestionType.TEXT,
      difficulty: Difficulty.MEDIUM,
    });
  }

  // Hard questions
  for (let i = 0; i < hardCount; i++) {
    questions.push({
      question: `${roundName} - Hard Question ${i + 1}`,
      answer: ANSWER.OPTION3,
      option1: 'Hard Option 1',
      option2: 'Hard Option 2',
      option3: 'Hard Option 3',
      option4: 'Hard Option 4',
      type: QuestionType.TEXT,
      difficulty: Difficulty.HARD,
    });
  }

  return questions;
}

// Run the seeding function
main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
