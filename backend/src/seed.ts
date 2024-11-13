import { Difficulty, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function mainSeed() {
  try {

    // Create a Quiz (Test)
    const quiz = await prisma.quiz.create({
      data: {
        name: 'FESTLA Quiz',
        quizcode: 'FESTLA-2024',
        duration: 60,
        startTiming: new Date(),
        date: new Date(),
      },
    });

    // Create Rounds
    await prisma.round.createMany({
      data: [
        { quizId: quiz.id, name: 'Screening', easyQ: 10, mediumQ: 5, hardQ: 2 },
        { quizId: quiz.id, name: 'Pre-final', easyQ: 10, mediumQ: 5, hardQ: 2 },
        { quizId: quiz.id, name: 'Final', easyQ: 10, mediumQ: 5, hardQ: 2 },
      ],
    });
    const rounds = await prisma.round.findMany();
    const roundIds = [1, 2, 3]; // Assuming these are the round IDs for Screening, Pre-final, and Final
    const difficulties: Difficulty[] = ['EASY', 'MEDIUM', 'HARD'];

    // Create Questions for each Round
    rounds.forEach(async ({ id: roundId }) => {

      for (let i = 1; i <= 100; i++) {
        await prisma.question.create({
          data: {
            question: `Sample Question ${i} for Round ${roundId}`,
            option1: `Option 1 for Question ${i}`,
            option2: `Option 2 for Question ${i}`,
            option3: `Option 3 for Question ${i}`,
            option4: `Option 4 for Question ${i}`,
            answer: 'OPTION1', // Example: Answer is Option 1
            type: 'TEXT',
            difficulty: difficulties[i % 3],
            roundId: roundId,
          },
        });
      }

    })

    // Create Teams (20 teams)
    for (let i = 1; i <= 20; i++) {
      await prisma.team.create({
        data: {
          name: `Team ${i}`,
          quizId: quiz.id,
        },
      });
      // teams.push(team);
    }

    // Create Users for each Team (2 users per team)
    const teams = await prisma.team.findMany();
    const userNames = [
      'Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Heidi', 'Ivan', 'Jack',
      'Kathy', 'Leo', 'Mona', 'Nina', 'Oscar', 'Paul', 'Quincy', 'Rachel', 'Steve', 'Trudy', 'Abhay'
    ];

    let userIndex = 0;
    for (const team of teams) {
      for (let i = 1; i <= 2; i++) {
        await prisma.user.create({
          data: {
            name: userNames[userIndex],
            email: `${userNames[userIndex]?.toLowerCase()}@example.com`,
            teamId: team.id,
          },
        });
        userIndex++;
      }
    }

    console.log('Seeding completed!');

  }
  catch (e) {
    console.error(e)
  }
}
