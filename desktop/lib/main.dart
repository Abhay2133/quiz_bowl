import 'package:desktop/screens/home/home_screen.dart';
import 'package:desktop/screens/login/login_screen.dart';
import 'package:desktop/screens/quiz/quiz_screen.dart';
import 'package:desktop/screens/start/start_screen.dart';
import 'package:desktop/screens/submission/submission_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:window_manager/window_manager.dart';

void main() async {
  await dotenv.load(fileName: '.env');

  WidgetsFlutterBinding.ensureInitialized();
  await windowManager.ensureInitialized();

  // Initialize window options
  windowManager.waitUntilReadyToShow().then((_) async {
    await windowManager.setFullScreen(false); // Start in windowed mode
  });
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Quiz Bowl',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      initialRoute: '/quiz',
      routes: {
        '/': (context) => HomeScreen(),
        '/login': (context) => LoginScreen(),
        '/start': (context) => StartScreen(),
        '/quiz': (context) => QuizScreen(),
        '/submission': (context) => SubmissionScreen(),
      },
    );
  }
}
