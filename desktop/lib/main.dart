import 'package:desktop/screens/home/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:window_manager/window_manager.dart';

void main() async {
  await dotenv.load(fileName: '.env');

  // WidgetsFlutterBinding.ensureInitialized();
  // await windowManager.ensureInitialized();

  // // Initialize window options
  // windowManager.waitUntilReadyToShow().then((_) async {
  //   await windowManager.setFullScreen(false); // Start in windowed mode
  // });
  // Ensure window manager is initialized before the app runs
  WidgetsFlutterBinding.ensureInitialized();
  await windowManager.ensureInitialized();

  // Set up the window options
  const WindowOptions windowOptions = WindowOptions(
    fullScreen: true, // Start the app in full screen mode
  );
  windowManager.waitUntilReadyToShow(windowOptions, () async {
    await windowManager.show();
    await windowManager.focus();
  });
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: HomeScreen(),
    );

    // return MaterialApp(
    //   debugShowCheckedModeBanner: false,
    //   title: 'Quiz Bowl',
    //   theme: ThemeData(
    //     primarySwatch: Colors.blue,
    //   ),
    //   initialRoute: '/submission',
    //   // initialRoute: '/rounds',
    //   routes: {
    //     '/': (context) => HomeScreen(),
    //     '/login': (context) => LoginScreen(),
    //     '/start': (context) => StartScreen(),
    //     '/quiz': (context) => QuizScreen(),
    //     '/submission': (context) => SubmissionScreen(),
    //     '/question': (context) => QuizQuestionScreen(),
    //     '/rounds': (context) => RoundsScreen(),

    //     // DEMO ROUTES FOR UI TESTING

    //     '/demo/form': (context) => LoginForm(),
    //     '/demo/timer': (context) => TimerScreen()
    //   },
    // );
  }
}
