import 'dart:async';

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
  bool isStartEnabled = false;
  late DateTime startTime;
  late Timer _timer;
  bool isStarting = false;

  final _storage = FlutterSecureStorage();
  late Map<String, dynamic> data;

  // get http => null;

  @override
  void initState() {
    super.initState();
    fetchQuizInfo();
  }

  void _checkStartButtonState() {
    DateTime now = DateTime.now();

    // If the target datetime has already passed, enable the button immediately
    if (now.isAfter(startTime)) {
      setState(() {
        isStartEnabled = true;
      });
    } else {
      // Set up a timer to enable the button at the target datetime
      Duration timeDifference = startTime.difference(now);
      _timer = Timer(timeDifference, () {
        setState(() {
          isStartEnabled = true;
        });
      });
    }
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
        DateTime date = DateTime.parse(data["date"]).toLocal();
        DateTime time = DateTime.parse(data['timing']).toLocal();

        DateTime datetime = DateTime(date.year, date.month, date.day, time.hour,
            time.minute, time.second, time.millisecond, time.microsecond);

        quizState.setQuizData(
            data["userName"],
            data["teammateName"],
            data["duration"],
            data["teamName"],
            datetime,
            data["quizId"],
            data["teamId"],
            data["userId"]);

        setState(() {
          _isLoading = false;
        });
        // handling start button timer
        startTime = datetime;
        _checkStartButtonState();
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      // dialog
      // Handle errors
      print('Error: $e');
      setState(() {
        // _isLoading = false;
      });

      showDialog(
          context: context,
          builder: (BuildContext context) {
            return AlertDialog(
              title: Text("Requset Failed"),
              content: Text("Unable to load quiz data"),
              actions: [
                // TextButton(
                //   onPressed: () {
                //     Navigator.of(context).pop(); // Close the dialog
                //   },
                //   child: Text("No"),
                // ),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue[800],
                      foregroundColor: Colors.white),
                  onPressed: () {
                    // Add your submission logic here
                    fetchQuizInfo();
                    Navigator.of(context).pop(); // Close the dialog
                    // Navigator.pop(context);|
                  },
                  child: Text("Retry"),
                ),
              ],
            );
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

  Future<void> _onStartClicked() async {
    _showStartingSpinner();
    // return;
    final appState = Provider.of<MyAppState>(context, listen: false);
    final baseUrl = dotenv.env["BASE_URL"];
    final url = Uri.parse('$baseUrl/user/generate-quiz/${appState.quizcode}');

    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        Map<String, dynamic> data = jsonDecode(response.body);

        appState.setRounds(data);

        // after loading rounds data succesfully
        appState.setStartTime(DateTime.now());
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const RoundsScreen(),
          ),
        );
      } // endif
      else {
        _showRetryStart(response.statusCode);
      }
    } catch (error) {
      print('$error');
      _showRetryStart(error);
    }
  }

  void _showStartingSpinner() {
    this.isStarting = true;
    showDialog(
        barrierDismissible: false,
        context: context,
        builder: (BuildContext context) {
          return Dialog(
              child: Container(
            child: Center(child: CircularProgressIndicator()),
            height: 200.0,
            width: 200.0,
          ));
        });
  }

  void _hideStartingSpinner() {
    Navigator.of(context).pop();
    this.isStarting = false;
  }

  void _showRetryStart([Object? error]) {
    if (this.isStarting) _hideStartingSpinner();
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text("Failed to Start Quiz"),
            content: Text(
                "Retry after some time${error != null ? "\nError : $error" : ""}"),
            actions: [
              // TextButton(
              //   onPressed: () {
              //     Navigator.of(context).pop(); // Close the dialog
              //   },
              //   child: Text("No"),
              // ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blue[800],
                    foregroundColor: Colors.white),
                onPressed: () {
                  // Add your submission logic here
                  _onStartClicked();
                  Navigator.of(context).pop(); // Close the dialog
                  // Navigator.pop(context);|
                },
                child: Text("Retry"),
              ),
            ],
          );
        });
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
                      child: SingleChildScrollView(
                          child: _isLoading ? QuizInfoSkeleton() : QuizInfo()),
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
              buildBottomBar(context, appState)
            ],
          );
        },
      ),
    );
  }

  Widget buildBottomBar(BuildContext context, MyAppState appState) {
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
              if (!isStartEnabled) return;
              _onStartClicked();
            },
            icon: const Icon(Icons.play_arrow),
            label: const Text('Start Test'),
            style: ElevatedButton.styleFrom(
              backgroundColor:
                  isStartEnabled ? Colors.blue[500] : Colors.grey[800],
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
              const SizedBox(width: 8),
              Text(
                isStartEnabled
                    ? 'Click to Start the Test'
                    : 'Test will start soon',
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
