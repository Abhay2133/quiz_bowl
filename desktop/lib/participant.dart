import 'package:desktop/api_service.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

class ParticipantPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Waiting Room'),
        automaticallyImplyLeading: false, // Prevents back navigation
        actions: [
          IconButton(
            icon: Icon(Icons.logout), // Logout icon
            onPressed: () async {
              // Handle logout action here, e.g., navigate to login screen
              Navigator.pushReplacementNamed(context, '/');
              final ApiService apiService = ApiService(
                  baseUrl: dotenv.env["API_URL"] ??
                      "http://localhost:3000/api"); // Replace with your API base URL
              await apiService.logout();
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Logged out successfully')),
              );
            },
          ),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.hourglass_empty,
                size: 80.0,
                color: Colors.blueAccent,
              ),
              SizedBox(height: 20),
              Text(
                'Waiting for the competition to start...',
                style: TextStyle(fontSize: 20.0, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 10),
              Text(
                'The competition will begin shortly. Please stay on this screen until the event starts.',
                style: TextStyle(fontSize: 16.0),
                textAlign: TextAlign.center,
              ),
              SizedBox(height: 30),
              ElevatedButton(
                onPressed: () {
                  // Placeholder for refreshing status or checking competition start
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Checking for updates...')),
                  );
                },
                child: Text('Refresh Status'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
