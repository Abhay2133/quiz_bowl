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

  static Question emty(){
    return Question(id: 0, question: "Empty Question", option1: "option1", option2: "option2", option3: "option3", option4: "option4", type: "TEXT", link: null);
  }
}

class Answer {
  final int qid;
  final int ans;

  Answer({required this.qid, required this.ans});
}

class Round {
  final int id;
  final String name;
  final List<Question> questions;
  // final int attempted;
  final int total;
  final String quizcode;
  final int quizId;
  final Map<int, Answer> answers;

  // Constructor for Round
  Round({
    required this.answers,
    required this.total,
    required this.id,
    required this.name,
    required this.questions,
    // required this.attempted,
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
    // attempted: 2,
    total: sampleQuestions.length,
    quizcode: "ABC123",
    quizId: 101,
    answers: {}, // Maps questionIndex to Answer
  ),
  Round(
    id: 2,
    name: "Pre-final Round",
    questions: sampleQuestions,
    // attempted: 3,
    total: sampleQuestions.length,
    quizcode: "DEF456",
    quizId: 102,
    answers: {},
  ),
  Round(
    id: 3,
    name: "Final Round",
    questions: sampleQuestions,
    // attempted: 4,
    total: sampleQuestions.length,
    quizcode: "GHI789",
    quizId: 103,
    answers: {1: Answer(qid: 31, ans: 1)},
  ),
];

class MyAppState extends ChangeNotifier {
  DateTime startTime = DateTime.now();
  String email = 'alice@example.com';
  String quizcode = 'FESTLA-2024';
  int quizId = 1;
  DateTime datetime = DateTime.now();
  String teamname = 'Conquorer 101';
  List<Round> rounds = [];//sampleRounds;
  String jwtToken = '';
  String userName = 'Abhay';
  String teammateName = 'Shivani';
  int duration = 60;
  bool isQuizLoaded = false;
  int teamId = 1;
  int userId = 1;

  void reset() {
    startTime = DateTime.now();
    email = '';
    teamId = 0;
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
    userId = 0;

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
      String teamname, DateTime datetime, int quizId, int teamId, int userId) {
    this.userName = userName;
    this.teammateName = teammateName;
    this.duration = duration;
    this.teamname = teamname;
    this.datetime = datetime;
    this.quizId = quizId;
    this.isQuizLoaded = true;
    this.teamId = teamId;
    this.userId = userId;

    notifyListeners();
  }

  void setQuizLoaded(bool val) {
    this.isQuizLoaded = val;

    notifyListeners();
  }

  void setAnswer(int roundId, int qid, int answer) {
    this.rounds.firstWhere((round) => round.id == roundId).answers[qid] =
        Answer(qid: qid, ans: answer);

    notifyListeners();
  }

  void removeAnswer(int roundId, int qid) {
    this.rounds.firstWhere((round) => round.id == roundId).answers.remove(qid);

    notifyListeners();
  }

  void setRounds(Map<String, dynamic> data) {
    final List<Round> newRounds = [];
    final List<dynamic> rounds = data["rounds"];

    // populating rounds from data
    for (var round in rounds) {
      int id = round['id'];
      String name = round['name'];
      List<dynamic> questions = round['questions'];
      List<Question> newQuestions = [];

      // populating questions for each round
      for (final q in questions) {
        Question question = Question(
            id: q["id"],
            question: q["question"],
            option1: q["option1"],
            option2: q["option2"],
            option3: q["option3"],
            option4: q["option4"],
            type: q["type"],
            link: q["link"]);
        newQuestions.add(question);
      }

      final newRound = Round(
          answers: {},
          total: questions.length,
          id: id,
          name: name,
          questions: newQuestions,
          quizcode: quizcode,
          quizId: quizId);
        
      newRounds.add(newRound);
    }

    this.rounds = newRounds;

    notifyListeners();
  }
}
