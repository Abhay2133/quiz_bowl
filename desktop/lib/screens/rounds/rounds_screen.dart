import 'package:desktop/appstate.dart';
import 'package:desktop/main.dart';
import 'package:desktop/screens/question/question_screen.dart';
import 'package:desktop/screens/submission/submission_screen.dart';
import 'package:desktop/widgets/quiz_info.dart';
import 'package:desktop/widgets/timer.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:provider/provider.dart';

class RoundsScreen extends StatefulWidget {
  const RoundsScreen({super.key});

  @override
  State<RoundsScreen> createState() => _RoundsScreenState();
}

class _RoundsScreenState extends State<RoundsScreen> {
  bool choose = true;
  final _storage = FlutterSecureStorage();

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
    return Scaffold(
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isSmallScreen = constraints.maxWidth < 600;
          return Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Side-Panel
              Container(
                width: 350, //isSmallScreen ? constraints.maxWidth * 0.4 : 300,
                color: const Color(0xFFF0F0FF),
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Expanded(child: SingleChildScrollView(child: QuizInfo())),
                    buildFinalSubmitButton()
                  ],
                ),
              ),

              // Rounds List
              Expanded(child: QuizRounds())
            ],
          );
        },
      ),
    );
  }

  Widget buildFinalSubmitButton() {
    return ElevatedButton(
      onPressed: () {
        // Button action here
        showConfirmDialog(context);
      },
      style: ElevatedButton.styleFrom(
        foregroundColor: Colors.white,
        backgroundColor: Colors.blue, // Text color
        padding: EdgeInsets.symmetric(vertical: 16), // Vertical padding
        textStyle: TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.w400,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8), // Rounded corners
        ),
      ),
      child: Text('Final Submit'),
    );
  }

  void showConfirmDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text("Confirm Submission"),
          content: Text("Are you sure you want to submit the quiz?"),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop(); // Close the dialog
              },
              child: Text("No"),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blue[800],
                  foregroundColor: Colors.white),
              onPressed: () {
                // Add your submission logic here

                Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (builder) => SubmissionScreen()));
              },
              child: Text("Yes"),
            ),
          ],
        );
      },
    );
  }

  Widget buildRules(BuildContext context) {
    return const SingleChildScrollView(
      child: Padding(
        padding: EdgeInsets.all(30.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Rules and Regulations",
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

class QuizRounds extends StatelessWidget {
  const QuizRounds({super.key});

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<MyAppState>();

    return Container(
      color: Colors.white,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                  child: CountdownTimer(
                time: appState.startTime
                    .add(Duration(minutes: appState.duration)),
                onFinish: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => SubmissionScreen()));
                },
              )),
              const SizedBox(height: 24),
              const Text(
                'Rounds',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 16),
              ...List.generate(
                  appState.rounds.length,
                  (index) => Padding(
                        padding: const EdgeInsets.symmetric(
                            vertical: 5.0, horizontal: 20.0),
                        child: Card(
                          elevation: 2,
                          color: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                            side: const BorderSide(
                              color: Colors.grey,
                              width: 0.5,
                            ),
                          ),
                          child: Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Row(
                              mainAxisAlignment:
                                  MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment:
                                      CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      '${index + 1}. ${appState.rounds[index].name}',
                                      style: const TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      'Answered: ${appState.rounds[index].answers.length} / ${appState.rounds[index].questions.length}',
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ],
                                ),
                                ElevatedButton(
                                  onPressed: () {
                                    // Navigator.pushNamed(context, "/question");
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) =>
                                            QuizQuestionScreen(
                                          roundId: appState.rounds[index].id,
                                        ),
                                      ),
                                    );
                                    // Navigator.push(context,
                                    // MaterialPageRoute(builder: (context) => const QuizQuestionScreen()));
                                  },
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Colors.blue,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                  ),
                                  child: const Text('OPEN'),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ))
            ],
          ),
        ),
      ),
    );
  }
}
