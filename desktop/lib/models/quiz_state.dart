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

class QuizState {
  final String quizcode;
  final String email;
  final String userName;
  final String teammateName;
  final int quizId;
  final DateTime time;
  final String teamname;
  final List<Round> rounds;
  // final List<String> questions;
  final String jwtToken;
  final int duration;

  QuizState({
    required this.duration,
    required this.userName,
    required this.teammateName,
    required this.jwtToken,
    required this.email,
    required this.quizcode,
    required this.quizId,
    required this.time,
    required this.teamname,
    required this.rounds,

    // required this.questions,
  });

  // Method to update QuizState with new values
  QuizState copyWith(
      {String? quizcode,
      int? duration,
      int? quizId,
      DateTime? time,
      String? teamname,
      List<Round>? rounds,
      List<String>? questions,
      String? jwtToken,
      String? teammateName,
      String? userName,
      String? email}) {
    return QuizState(
      jwtToken: jwtToken ?? this.jwtToken,
      quizcode: quizcode ?? this.quizcode,
      quizId: quizId ?? this.quizId,
      time: time ?? this.time,
      teamname: teamname ?? this.teamname,
      rounds: rounds ?? this.rounds,
      email: email ?? this.email,
      userName: userName ?? this.userName,
      teammateName: teammateName ?? this.teammateName,
      duration: duration ?? this.duration,
    );
  }
}
