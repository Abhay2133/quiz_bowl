import 'package:desktop/screens/home/home_screen.dart';
import 'package:flutter/material.dart';

class SubmissionScreen extends StatefulWidget {
  const SubmissionScreen({super.key});

  @override
  State<SubmissionScreen> createState() => _SubmissionScreenState();
}

class _SubmissionScreenState extends State<SubmissionScreen> {
  bool _isUploaded = true;
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
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 30.0),
        child: const Text(
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
