// tests/question.test.ts
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app from '../app'; // Import the Express app
import prisma from '../prisma/client'; // Import Prisma client

// Set up a test suite for Question API
describe('Question API', () => {
  
  before(async () => {
    // Optionally, clear database or set up initial state
    await prisma.question.deleteMany(); // Clear out any existing questions
  });

  after(async () => {
    // Optionally, clean up any test data after tests finish
    await prisma.question.deleteMany();
  });

  test('POST /api/questions - Create a new question', async () => {
    const res = await request(app)
      .post('/api/questions')
      .send({
        question: 'What is 2 + 2?',
        answer: '4',
        option1: '3',
        option2: '4',
        option3: '5',
        option4: '6',
        type: 'TEXT',
        difficulty: 'EASY',
        roundId: 1, // Assume there’s a round with ID 1
      });
    assert.strictEqual(res.status, 201);
    assert.ok(res.body.id);
    assert.strictEqual(res.body.question, 'What is 2 + 2?');
  });

  test('GET /api/questions - Retrieve all questions', async () => {
    const res = await request(app)
      .get('/api/questions')
      .expect(200);
    assert.ok(Array.isArray(res.body), 'Expected response to be an array');
  });

  test('GET /api/questions/:id - Retrieve a question by ID', async () => {
    // First, create a question
    const createRes = await request(app)
      .post('/api/questions')
      .send({
        question: 'What is the capital of France?',
        answer: 'Paris',
        option1: 'Paris',
        option2: 'London',
        option3: 'Berlin',
        option4: 'Madrid',
        type: 'TEXT',
        difficulty: 'EASY',
        roundId: 1,
      });
    const questionId = createRes.body.id;

    // Now, fetch the question by ID
    const res = await request(app)
      .get(`/api/questions/${questionId}`)
      .expect(200);
    assert.strictEqual(res.body.id, questionId);
    assert.strictEqual(res.body.question, 'What is the capital of France?');
  });

  test('PUT /api/questions/:id - Update a question', async () => {
    // First, create a question
    const createRes = await request(app)
      .post('/api/questions')
      .send({
        question: 'What is 3 + 5?',
        answer: '8',
        option1: '6',
        option2: '7',
        option3: '8',
        option4: '9',
        type: 'TEXT',
        difficulty: 'EASY',
        roundId: 1,
      });
    const questionId = createRes.body.id;

    // Now, update the question
    const res = await request(app)
      .put(`/api/questions/${questionId}`)
      .send({
        question: 'What is 3 + 6?',
        answer: '9',
        option1: '8',
        option2: '9',
        option3: '10',
        option4: '11',
        type: 'TEXT',
        difficulty: 'MEDIUM',
        roundId: 1,
      })
      .expect(200);
    assert.strictEqual(res.body.question, 'What is 3 + 6?');
    assert.strictEqual(res.body.answer, '9');
  });

  test('DELETE /api/questions/:id - Delete a question', async () => {
    // First, create a question
    const createRes = await request(app)
      .post('/api/questions')
      .send({
        question: 'What is 5 + 5?',
        answer: '10',
        option1: '9',
        option2: '10',
        option3: '11',
        option4: '12',
        type: 'TEXT',
        difficulty: 'EASY',
        roundId: 1,
      });
    const questionId = createRes.body.id;

    // Now, delete the question
    await request(app)
      .delete(`/api/questions/${questionId}`)
      .expect(204);

    // Confirm deletion
    await request(app)
      .get(`/api/questions/${questionId}`)
      .expect(404); // Expect a 404 Not Found response
  });
});
