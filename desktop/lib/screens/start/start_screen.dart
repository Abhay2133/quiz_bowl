import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:desktop/appstate.dart';
import 'package:desktop/main.dart';
import 'package:desktop/screens/login/login_screen.dart';
import 'package:desktop/screens/rounds/rounds_screen.dart';
import 'package:desktop/widgets/quiz_info.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:provider/provider.dart';

class _StartScreen_ extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      body: Center(
        child: Text("Start Screen"),
      ),
    );
  }
}

class StartScreen extends StatefulWidget {
  const StartScreen({super.key});

  @override
  State<StartScreen> createState() => _StartScreenState();
}

class _StartScreenState extends State<StartScreen> {
  bool _isLoading = true;
  final _storage = FlutterSecureStorage();
  late Map<String, dynamic> data;

  // get http => null;

  @override
  void initState() {
    super.initState();
    fetchQuizInfo();
  }

  Future<void> fetchQuizInfo() async {
    final quizState = Provider.of<MyAppState>(context, listen: false);

    final baseUrl = dotenv.env["BASE_URL"];
    final url =
        Uri.parse('$baseUrl/user/quizInfo'); // replace with your API endpoint
    final headers = {"Content-Type": "application/json"};
    final body = jsonEncode({
      "email": quizState.email,
      "quizcode": quizState.quizcode
    }); // Add your request payload here

    try {
      final response = await http.post(url, headers: headers, body: body);

      if (response.statusCode == 200) {
        Map<String, dynamic> data = jsonDecode(response.body);
        quizState.setQuizData(
            data["userName"],
            data["teammateName"],
            data["duration"],
            data["teamName"],
            DateTime.parse(data["timing"]),
            data["quizId"]);

        setState(() {
          _isLoading = false;
        });
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      // Handle errors
      print('Error: $e');
      setState(() {
        // _isLoading = false;
      });
    }
  }

  Future<void> _logout() async {
    // Delete the JWT token from secure storage
    await _storage.delete(key: 'jwtToken');

    // Display a logout message
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Logged out successfully")),
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<MyAppState>();
    return Scaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isSmallScreen = constraints.maxWidth < 600;
          return Column(
            children: [
              // sidebar + (rules)
              Expanded(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Container(
                      width:
                          350, //isSmallScreen ? constraints.maxWidth * 0.4 : 300,
                      color: const Color(0xFFF0F0FF),
                      padding: const EdgeInsets.all(24),
                      child: SingleChildScrollView(child: _isLoading ? QuizInfoSkeleton():QuizInfo()),
                    ),

                    //rules and info
                    //RulesAndInfo()
                    Expanded(
                      child: buildRules(context),
                    )
                  ],
                ),
              ),

              // Bottom Bar
              buildBottomBar(context)
            ],
          );
        },
      ),
    );
  }

  Widget buildBottomBar(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 24,
        vertical: 16,
      ),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        children: [
          ElevatedButton.icon(
            onPressed: () {
              // Navigator.pushNamed(context, "/rounds");
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const RoundsScreen(),
                ),
              );
              // setState(() {
              //   choose = false;
              // });
            },
            icon: const Icon(Icons.play_arrow),
            label: const Text('Start Test'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.grey[800],
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(
                horizontal: 24,
                vertical: 12,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Row(
            children: [
              const Icon(Icons.refresh, size: 16),
              const SizedBox(width: 8),
              Text(
                'Test will start soon',
                style: TextStyle(
                  color: Colors.grey[600],
                  fontSize: 14,
                ),
              ),
            ],
          ),
          const Spacer(),
          ElevatedButton(
            onPressed: () async {
              await _logout();
              Navigator.pushReplacement(context,
                  MaterialPageRoute(builder: (context) => const LoginScreen()));
              return;
              // if (_formKey.currentState!
              //     .validate()) {
              //   // Handle login logic
              // }
              Navigator.push(context,
                  MaterialPageRoute(builder: (context) => const StartScreen()));
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 24),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
                side: BorderSide(
                  color: Colors.black.withOpacity(0.8),
                  width: 1,
                ),
              ),
            ),
            child: Text(
              'Logout',
              style: TextStyle(
                fontSize: 14,
                fontWeight: FontWeight.w400,
                color: Colors.black.withOpacity(0.8),
              ),
            ),
          )
        ],
      ),
    );
  }

  Widget buildDetailSection(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.black54,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget buildRules(BuildContext context) {
    // TODO: implement build
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(30.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Rules and Regulations ",
              style: TextStyle(
                fontSize: 24,
                // fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

