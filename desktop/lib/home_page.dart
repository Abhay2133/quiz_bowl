import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Text(
              'Quiz Bowl',
              style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 50), // Spacing between text and buttons
            ElevatedButton(
              onPressed: () {
                // Navigate to Admin Login Page
                Navigator.pushNamed(context, '/adminLogin');
              },
              child: Text('Admin Login'),
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 40, vertical: 15),
              ),
            ),
            SizedBox(height: 20), // Spacing between buttons
            ElevatedButton(
              onPressed: () {
                // Navigate to Participant Login Page
                Navigator.pushNamed(context, '/participantLogin');
              },
              child: Text('Participant Login'),
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.symmetric(horizontal: 40, vertical: 15),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
