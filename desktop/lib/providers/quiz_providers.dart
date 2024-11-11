// lib/providers/quiz_provider.dart

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/quiz_state.dart';

class QuizNotifier extends StateNotifier<QuizState> {
  QuizNotifier()
      : super(QuizState(
          email: '',
          quizcode: '',
          quizId: 0,
          time: DateTime.now(),
          teamname: '',
          rounds: [],
          // questions: [],
          jwtToken: '',
          userName: '',
          teammateName: '', duration: 0,
          // questions: [],
        ));

  void setLoginData(String email, String quizcode, String jwtToken){
    state = state.copyWith(email: email, quizcode: quizcode, jwtToken: jwtToken);
  }

  void setQuizData(
    int duration,
    String name,
    DateTime time,
    String teamname,
  ) {
    state = state.copyWith(
      duration: duration,
      time: time,
      teamname: teamname,
    );
  }

  void setRoundData() {}

  void setRoundQuestions() {}
}

final quizProvider = StateNotifierProvider<QuizNotifier, QuizState>((ref) {
  return QuizNotifier();
});
