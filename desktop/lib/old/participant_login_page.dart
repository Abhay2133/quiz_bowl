import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'api_service.dart'; // Import the ApiService

class ParticipantLoginPage extends StatefulWidget {
  @override
  _ParticipantLoginPageState createState() => _ParticipantLoginPageState();
}

class _ParticipantLoginPageState extends State<ParticipantLoginPage> {
  final ApiService apiService = ApiService(baseUrl: dotenv.env["API_URL"] ?? "http://localhost:3000/api"); // Replace with your API base URL
  final _formKey = GlobalKey<FormState>();
  String? username;
  String? password;

  void _login() async {
    if (_formKey.currentState!.validate()) {
      try {
        final token = await apiService.login(username!, password!);
        if (token != null) {
          // Successfully logged in
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Logged in successfully!')),
          );
          Navigator.pushReplacementNamed(context, "/participant");
          // Navigate to protected route or perform other actions
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Login failed: ${e.toString()}')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(""),),
      body: Center(
        // Center the container in the middle of the screen
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Container(
            width: 300, // Set a fixed width for the container
            child: Form(
              key: _formKey, // Attach the form key
              child: Column(
                mainAxisSize: MainAxisSize.min, // Minimize height of the column
                children: [
                  Text(
                    "Participant Login",
                    style: TextStyle(fontSize: 32),
                  ),
                  SizedBox(
                    height: 40,
                  ),
                  TextFormField(
                    decoration: InputDecoration(
                      labelText: 'Username',
                      border: OutlineInputBorder(),
                    ),
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your username';
                      }
                      return null; // Valid username
                    },
                    onChanged: (value) {
                      username = value; // Update username
                    },
                  ),
                  SizedBox(height: 16), // Spacing between fields
                  TextFormField(
                    decoration: InputDecoration(
                      labelText: 'Password',
                      border: OutlineInputBorder(),
                    ),
                    obscureText: true, // Hide password input
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your password';
                      }
                      return null; // Valid password
                    },
                    onChanged: (value) {
                      password = value; // Update password
                    },
                  ),
                  SizedBox(height: 20), // Spacing before button
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      padding: EdgeInsets.symmetric(
                          horizontal: 50, vertical: 10), // Button padding
                    ),
                    onPressed: _login,
                    child: Text('Login'),
                  ),
                  
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
