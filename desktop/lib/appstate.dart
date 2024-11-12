import 'package:flutter/material.dart';

class Question {
  late int id;
  String question;
  String option1;
  String option2;
  String option3;
  String option4;
  String type;
  String? link;

  // Constructor
  Question({
    required this.id,
    required this.question,
    required this.option1,
    required this.option2,
    required this.option3,
    required this.option4,
    required this.type,
    required this.link,
  });
}

class Round {
  final int id;
  final String name;
  final List<Question> questions;
  final int attempted;
  final int total;
  final String quizcode;
  final int quizId;
  final Map<int, int?> answers;

  // Constructor for Round
  Round({
    required this.answers,
    required this.total,
    required this.id,
    required this.name,
    required this.questions,
    required this.attempted,
    required this.quizcode,
    required this.quizId,
  });
}

// Sample data for questions
List<Question> sampleQuestions = [
  Question(
    id: 1,
    question: "What is the capital of France?",
    option1: "Berlin",
    option2: "Madrid",
    option3: "Paris",
    option4: "Rome",
    type: "MCQ",
    link: null,
  ),
  Question(
    id: 2,
    question: "What is 5 + 7?",
    option1: "10",
    option2: "11",
    option3: "12",
    option4: "13",
    type: "MCQ",
    link: null,
  ),
  Question(
    id: 3,
    question: "Who wrote 'Hamlet'?",
    option1: "Charles Dickens",
    option2: "William Shakespeare",
    option3: "J.K. Rowling",
    option4: "Mark Twain",
    type: "MCQ",
    link: null,
  ),
  Question(
    id: 4,
    question: "Select the image representing a cat",
    option1: "Dog Image",
    option2: "Bird Image",
    option3: "Cat Image",
    option4: "Fish Image",
    type: "Image",
    link: "https://example.com/cat-image.jpg",
  ),
];

// Sample data for rounds
List<Round> sampleRounds = [
  Round(
    id: 1,
    name: "Screening Round",
    questions: sampleQuestions,
    attempted: 2,
    total: sampleQuestions.length,
    quizcode: "ABC123",
    quizId: 101,
    answers: {1: 3, 2: 3}, // Maps questionId to selected option
  ),
  Round(
    id: 2,
    name: "Pre-final Round",
    questions: sampleQuestions,
    attempted: 3,
    total: sampleQuestions.length,
    quizcode: "DEF456",
    quizId: 102,
    answers: {1: 2, 2: 3, 3: 2},
  ),
  Round(
    id: 3,
    name: "Final Round",
    questions: sampleQuestions,
    attempted: 4,
    total: sampleQuestions.length,
    quizcode: "GHI789",
    quizId: 103,
    answers: {1: 3, 2: 3, 3: 2, 4: 3},
  ),
];

class MyAppState extends ChangeNotifier {
  DateTime startTime = DateTime.now();
  String email = 'alice@example.com';
  String quizcode = 'FESTLA-2024';
  int quizId = 0;
  DateTime datetime = DateTime.now();
  String teamname = 'Conquorer 101';
  List<Round> rounds = sampleRounds;
  String jwtToken = '';
  String userName = 'Abhay';
  String teammateName = 'Shivani';
  int duration = 60;
  bool isQuizLoaded = false;

  void reset() {
    startTime = DateTime.now();
    email = '';
    quizcode = '';
    quizId = 0;
    datetime = DateTime.now();
    teamname = '';
    rounds = [];
    jwtToken = '';
    userName = '';
    teammateName = '';
    duration = 1;
    isQuizLoaded = false;
    notifyListeners();
  }

  void setLoginData(String email, String quizcode, String jwtToken) {
    this.jwtToken = jwtToken;
    this.email = email;
    this.quizcode = quizcode;

    notifyListeners();
  }

  void setStartTime(DateTime time) {
    startTime = time;
    notifyListeners();
  }

  void setQuizData(String userName, String teammateName, int duration,
      String teamname, DateTime datetime, int quizId) {
    this.userName = userName;
    this.teammateName = teammateName;
    this.duration = duration;
    this.teamname = teamname;
    this.datetime = datetime;
    this.quizId = quizId;
    this.isQuizLoaded = true;

    notifyListeners();
  }

  void setQuizLoaded(bool val) {
    this.isQuizLoaded = val;

    notifyListeners();
  }

  void setAnswer(int roundId, int qid, int? answer) {
    this.rounds.firstWhere((round) => round.id == roundId).answers[qid] =
        answer;

    notifyListeners();
  }

  void removeAnswer(int roundId, int qid) {
    this.rounds.firstWhere((round) => round.id == roundId).answers.remove(qid);

    notifyListeners();
  }
}
