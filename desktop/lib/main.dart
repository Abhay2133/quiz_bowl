import 'package:desktop/appstate.dart';
import 'package:desktop/screens/home/home_screen.dart';
import 'package:desktop/screens/question/question_screen.dart';
import 'package:desktop/screens/start/start_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
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
  // const WindowOptions windowOptions = WindowOptions(
  //   fullScreen: true, // Start the app in full screen mode
  // );
  // windowManager.waitUntilReadyToShow(windowOptions, () async {
  //   await windowManager.show();
  //   await windowManager.focus();
  // });

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context)=>MyAppState(),
      child: const MaterialApp(
        debugShowCheckedModeBanner: false,
        home: StartScreen(),
      ),
    );
  }
}
