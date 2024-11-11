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

  // Constructor for Round
  Round({
    required this.total,
    required this.id,
    required this.name,
    required this.questions,
    required this.attempted,
    required this.quizcode,
    required this.quizId,
  });
}

class MyAppState extends ChangeNotifier {
  String email = 'alice@example.com';
  String quizcode = 'FESTLA-2024';
  int quizId = 0;
  DateTime time = DateTime.now();
  String teamname = 'Conquorer 101';
  List<Round> rounds = [];
  String jwtToken = '';
  String userName = 'Abhay';
  String teammateName = 'Shivani';
  int duration = 60;
  bool isQuizLoaded = false;

  void setLoginData(String email, String quizcode, String jwtToken) {
    this.jwtToken = jwtToken;
    this.email = email;
    this.quizcode = quizcode;

    notifyListeners();
  }

  void setQuizData(String userName, String teammateName, int duration,
      String teamname, DateTime time, int quizId) {
    this.userName = userName;
    this.teammateName = teammateName;
    this.duration = duration;
    this.teamname = teamname;
    this.time = time;
    this.quizId = quizId;
    this.isQuizLoaded = true;

    notifyListeners();
  }

  void setQuizLoaded(bool val) {
    this.isQuizLoaded = val;

    notifyListeners();
  }
}
