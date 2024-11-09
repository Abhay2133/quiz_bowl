# Quiz Bowl Competition Application

Welcome to the **Quiz Bowl Competition** application, designed for managing quiz competitions, organizing events, and tracking participants' performance in real-time. This application provides a seamless experience for users to take part in the competition, track their progress, and submit answers through an intuitive interface.

## Project Overview

The **Quiz Bowl** app serves as an online quiz competition platform that includes different rounds (Screening, Pre-final, Final). The backend handles user authentication, quiz submission, results calculation, and management. The frontend presents a user-friendly interface for participants and administrators.

### Features

- **User Authentication**: Users can sign in with their credentials (username, and test code).
- **Quiz Rounds**: Supports multiple rounds of the quiz.
- **Quiz Submission**: Users can submit answers and get scored automatically.
- **Real-time Progress Tracking**: The app tracks progress and displays the time remaining for each round.
- **Results Calculation**: Scores are calculated and saved for every user submission.

## Technologies Used

- **Frontend**:
  - React.js with Next.js
  - Tailwind CSS for styling
  - ShadCN for UI components
- **Backend**:
  - Express.js
  - TypeScript
  - Prisma ORM
  - PostgreSQL Database
- **Hosting & Deployment**:
  - Vercel for backend and frontend deployment
  - Cloudflare for domain hosting

## Project Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (for database setup)
- Prisma (for database management)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/abhay2133/quiz-bowl.git
   ```

2. Navigate into the project directory:

   ```bash
   cd quiz-bowl
   ```

3. Install dependencies for both frontend and backend:

   ```bash
   npm install
   ```

4. Setup the PostgreSQL database:

   - Create a new database in PostgreSQL and configure the database credentials in `.env` file.
   - Run Prisma migrations:
     ```bash
     npx prisma migrate dev
     ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The application should now be running locally. Visit `http://localhost:3000` in your browser to access the app.

## API Routes

Here is a list of API routes available in the Quiz Bowl competition backend:

### General Routes

- **GET `/api/ram-usage`**  
  Retrieves the current RAM usage of the server.

### User Routes

- **POST `/api/users`**  
  Creates a new user.
- **GET `/api/users`**  
  Retrieves a list of all users.

- **GET `/api/users/:id`**  
  Retrieves a specific user by ID.

- **PUT `/api/users/:id`**  
  Updates a specific user by ID.

- **DELETE `/api/users/:id`**  
  Deletes a specific user by ID.

- **GET `/api/users/team/:teamId`**  
  Retrieves users of a specific team.

### Team Routes

- **POST `/api/teams`**  
  Creates a new team.

- **GET `/api/teams`**  
  Retrieves a list of all teams.

- **GET `/api/teams/:id`**  
  Retrieves a specific team by ID.

- **PUT `/api/teams/:id`**  
  Updates a specific team by ID.

- **DELETE `/api/teams/:id`**  
  Deletes a specific team by ID.

- **GET `/api/teams/quiz/:id`**  
  Retrieves teams associated with a specific quiz.

### Quiz Routes

- **POST `/api/quizs`**  
  Creates a new quiz.

- **GET `/api/quizs`**  
  Retrieves a list of all quizzes.

- **GET `/api/quizs/:id`**  
  Retrieves a specific quiz by ID.

- **PUT `/api/quizs/:id`**  
  Updates a specific quiz by ID.

- **DELETE `/api/quizs/:id`**  
  Deletes a specific quiz by ID.

### Round Routes

- **POST `/api/rounds`**  
  Creates a new quiz round.

- **GET `/api/rounds/quiz/:quizId`**  
  Retrieves rounds for a specific quiz.

- **GET `/api/rounds/:id`**  
  Retrieves a specific round by ID.

- **PUT `/api/rounds/:id`**  
  Updates a specific round by ID.

- **DELETE `/api/rounds/:id`**  
  Deletes a specific round by ID.

### Question Routes

- **POST `/api/questions`**  
  Creates a new question.

- **GET `/api/questions`**  
  Retrieves a list of all questions.

- **GET `/api/questions/:id`**  
  Retrieves a specific question by ID.

- **PUT `/api/questions/:id`**  
  Updates a specific question by ID.

- **DELETE `/api/questions/:id`**  
  Deletes a specific question by ID.

- **GET `/api/questions/round/:roundId`**  
  Retrieves questions for a specific round.

### Authentication Routes

- **POST `/auth/user`**  
  User login authentication.

- **POST `/auth/admin`**  
  Admin login authentication.

### User Quiz and Round Routes

- **GET `/user/quiz/:quizcode`**  
  Retrieves the quiz associated with a specific quiz code.

- **GET `/user/rounds/quiz/:quizId`**  
  Retrieves the rounds for a specific quiz.

- **GET `/user/questions/round/:roundId`**  
  Retrieves the questions for a specific round.

- **GET `/user/questions/:id`**  
  Retrieves a specific question by ID.

- **POST `/user/submit`**  
  Submits the user's answers for scoring.

### Seed Routes

- **GET `/seed`**  
  Seeds the database with initial data.

### Miscellaneous Routes

- **GET `/`**  
  Retrieves the homepage or main route.

## Non-Technical Details

- **Event Name**: FESTLA
- **Quiz Rounds**: The competition consists of three rounds—Screening, Pre-final, and Final.
- **Scoring**: Each round has different time limits and scoring methods, with scores being automatically calculated based on the answers submitted.
- **User Interaction**: Users will be able to participate in the competition by logging in with their credentials, answering questions, and submitting their answers. After each submission, their progress and score will be updated.

## Contributing

We welcome contributions to improve the Quiz Bowl competition platform. If you want to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
