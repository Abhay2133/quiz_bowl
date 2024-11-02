import 'package:desktop/participant.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'home_page.dart'; // Import the homepage
import 'admin_login_page.dart'; // Import the admin login page
import 'participant_login_page.dart'; // Import the participant login page

void main() async {
  await dotenv.load(fileName: '.env');
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
      initialRoute: '/',
      routes: {
        '/': (context) => HomePage(),
        '/adminLogin': (context) => AdminLoginPage(), // Replace with your admin login page widget
        '/participantLogin': (context) => ParticipantLoginPage(), // Replace with your participant login page widget
        '/participant': (context) => ParticipantPage(), // Replace with your participant login page widget
      },
    );
  }
}
