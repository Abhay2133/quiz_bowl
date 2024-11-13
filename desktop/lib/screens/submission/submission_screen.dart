import 'package:desktop/appstate.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:desktop/screens/home/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class SubmissionScreen extends StatefulWidget {
  const SubmissionScreen({super.key});

  @override
  State<SubmissionScreen> createState() => _SubmissionScreenState();
}

class _SubmissionScreenState extends State<SubmissionScreen> {
  bool _isUploaded = false;

  @override
  void initState() {
    super.initState();
    // _uploadQuiz();
    Future.delayed(Duration.zero, () {
      this._uploadQuiz();
    });
  }

  Future<void> _uploadQuiz() async {
    final appState = Provider.of<MyAppState>(context, listen: false);
    // Define the URL of your backend API
    final String baseUrl = dotenv.env["BASE_URL"]!;
    final url = "$baseUrl/user/submit";

    Map<String, Map<String, int?>?> answers =
        {}; // {roundId:{answers:{qid, optionIndex}}}

    for (var round in appState.rounds) {
      // Map<String, int> _ans = ;
      // for(var )
      answers[round.id.toString()] =
          round.answers.map((key, ans) => MapEntry(ans.qid.toString(), ans.ans));
    }

    // Define the body of the POST request
    final Map<String, dynamic> requestBody = {
      "quizId": appState.quizId,
      "teamId": appState.teamId,
      "userId": appState.userId,
      "answers": answers,
    };

    try {
      // Make the POST request
      final response = await http.post(
        Uri.parse(url),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode(requestBody),
      );

      // Check the response status
      if (response.statusCode < 300) {
        setState(() {
          _isUploaded = true;
        });
        // Handle success, maybe parse response.body if needed
      } else {
        _showRetry();
        print('Failed to submit quiz: ${response.statusCode}');
        // Handle error, maybe parse response.body for more details
      }
    } catch (e) {
      _showRetry();
      print('Error submitting quiz: $e');
    }
  }

  void _showRetry() {
    showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            title: Text("Upload"),
            content: Text("Check you internet connection"),
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
                  _uploadQuiz();
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
    // TODO: implement build
    return Scaffold(
      body: Container(
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: AssetImage('assets/images/submission-background.jpg'),
              fit: BoxFit.cover,
            ),
          ),
          child: Center(
            child: SingleChildScrollView(
              child: Container(
                  width: 500.0,
                  padding: EdgeInsets.all(32),
                  decoration: BoxDecoration(
                      color: Colors.white, //.withOpacity(0.7),
                      borderRadius: BorderRadius.circular(16.0),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.08),
                          blurRadius: 15,
                          offset: const Offset(0, 4),
                        )
                      ]),
                  child: _isUploaded ? Uploaded() : Uploading()),
            ),
          )),
    );
  }

  Widget Div(String text, [double size = 16.0]) {
    return Text(
      text,
      style: TextStyle(fontSize: size),
    );
  }

  Widget Uploading() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(10.0),
          child: Image.asset(
            "assets/images/uploading.jpg",
            height: 300.0,
            width: 300.0,
          ),
        ),
        SizedBox(
          height: 20.0,
        ),
        Div("Uploading Quiz", 28.0),
        Div("To Server", 28.0),
        SizedBox(
          height: 10,
        ),
        Div("Keep the Window Open"),
        SizedBox(
          height: 30,
        ),
      ],
    );
  }

  Widget Uploaded() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        ClipRRect(
          borderRadius: BorderRadius.circular(10.0),
          child: Image.asset(
            "assets/images/uploaded.jpg",
            height: 300.0,
            width: 300.0,
          ),
        ),
        SizedBox(
          height: 40.0,
        ),
        Div("Quiz Uploaded", 28.0),
        // Div("Successfully", 28.0),
        SizedBox(
          height: 30,
        ),
        Div("Participant Name", 14),
        // const SizedBox(height: 10,),
        Div("Abhay Bisht"),
        const SizedBox(
          height: 10,
        ),
        Div("Team Name", 14),
        // const SizedBox(height: 10,),
        Div("Conqueror 101"),
        SizedBox(height: 30.0),
        bLogout()
      ],
    );
  }

  Widget bLogout() {
    return ElevatedButton(
      onPressed: () => {
        Navigator.push(context,
            MaterialPageRoute(builder: (context) => const HomeScreen()))
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFF4169E1),
        padding: const EdgeInsets.symmetric(
          vertical: 16,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
      ),
      child: const Padding(
        padding: EdgeInsets.symmetric(horizontal: 30.0),
        child: Text(
          'Logout',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}
