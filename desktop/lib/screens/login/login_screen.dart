import 'package:desktop/appstate.dart';
import 'package:desktop/main.dart';
import 'package:desktop/screens/home/home_screen.dart';
import 'package:desktop/screens/start/start_screen.dart';
import 'package:logger/logger.dart';
import 'dart:convert';

import 'package:http/http.dart' as http;

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:provider/provider.dart';

// class LoginScreen extends StatelessWidget {
//   @override
//   Widget build(BuildContext context) {
//     // TODO: implement build
//     return Scaffold(
//       body: Center(
//         child: Text("Login Screen"),
//       ),
//     );
//   }
// }

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  // final _teamController = TextEditingController();
  final _quizCodeController = TextEditingController();
  final _storage = FlutterSecureStorage();

  // get http => null;

  @override
  void initState() {
    super.initState();

    Future.delayed(Duration.zero, () {
      final appState = Provider.of<MyAppState>(context, listen:false);
      appState.reset();
    });
  }

  Future<void> _login(MyAppState appState) async {
    if (_formKey.currentState!.validate()) {
      final email = _emailController.text;
      final quizCode = _quizCodeController.text;

      final BASE_URL = dotenv.env['BASE_URL'];
      if (BASE_URL == null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("BASE_URL is not set")),
        );
        return;
      }

      final url = Uri.parse("$BASE_URL/auth/user");

      // final url = Uri.parse('http://localhost:5000');
      final headers = {'Content-Type': 'application/json'};
      final body = jsonEncode({'email': email, 'quizcode': quizCode});

      try {
        final response = await http.post(url, headers: headers, body: body);

        if (response.statusCode == 200) {
          final jsonResponse = jsonDecode(response.body);
          final jwtToken = jsonResponse['token'];

          // Save JWT token to secure storage
          await _storage.write(key: 'jwtToken', value: jwtToken);
          appState.setLoginData(email, quizCode, jwtToken);

          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const StartScreen(),
            ),
          );

          // save login data here
        } else {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
                content: Text("Login failed! Please check your credentials.")),
          );
        }
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("An error occurred: $e")),
        );
        var logger = Logger();
        logger.e("an error occurerd: $e");
      }
    }
  }

  @override
  void dispose() {
    _emailController.dispose();
    // _teamController.dispose();
    _quizCodeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<MyAppState>();
    return Scaffold(
      backgroundColor: const Color(0xFFF0F0FF),
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isSmallScreen = constraints.maxWidth < 900;

          return SingleChildScrollView(
            child: SizedBox(
              height: constraints.maxHeight,
              //  padding: const EdgeInsets.all(24),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    flex: 1,
                    child: Row(
                      children: [
                        Expanded(
                          flex: isSmallScreen ? 2 : 1,
                          child: SingleChildScrollView(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Padding(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 20.0, vertical: 10),
                                  child: IconButton(
                                    icon: Icon(Icons.arrow_back),
                                    onPressed: () {
                                      Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                          builder: (context) =>
                                              const HomeScreen(),
                                        ),
                                      );
                                    },
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(80.0),
                                  child: Container(
                                    // color: Colors.grey[600],
                                    child: Padding(
                                      padding: const EdgeInsets.all(15.0),
                                      child: Column(
                                        mainAxisAlignment:
                                            MainAxisAlignment.center,
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
                                        children: [
                                          // const SizedBox(height: 40),
                                          Text(
                                            'Welcome to',
                                            style: TextStyle(
                                              fontSize: isSmallScreen ? 24 : 32,
                                              fontWeight: FontWeight.w500,
                                            ),
                                          ),
                                          const SizedBox(height: 8),
                                          Text(
                                            'Quiz Bowl Challenge',
                                            style: TextStyle(
                                              fontSize: isSmallScreen ? 24 : 32,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                          const SizedBox(height: 16),
                                          Text(
                                            'Login to start quiz',
                                            style: TextStyle(
                                              fontSize: isSmallScreen ? 16 : 20,
                                              color: Colors.black54,
                                            ),
                                          ),
                                          const SizedBox(height: 48),
                                          Form(
                                            key: _formKey,
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                buildInputField(
                                                    'Participant Email',
                                                    _emailController,
                                                    emailValidator),
                                                // const SizedBox(height: 15),
                                                // buildInputField(
                                                //   'Team Name',
                                                //   _teamController,
                                                // ),
                                                const SizedBox(height: 15),
                                                buildInputField(
                                                  'Quiz Code',
                                                  _quizCodeController,
                                                ),
                                                const SizedBox(height: 15),
                                                SizedBox(
                                                  width: 130,
                                                  child: ElevatedButton(
                                                    onPressed: () {
                                                      _login(appState);
                                                    },
                                                    style: ElevatedButton
                                                        .styleFrom(
                                                      backgroundColor:
                                                          const Color(
                                                              0xFF4169E1),
                                                      padding: const EdgeInsets
                                                          .symmetric(
                                                        vertical: 16,
                                                      ),
                                                      shape:
                                                          RoundedRectangleBorder(
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(8),
                                                      ),
                                                    ),
                                                    child: const Text(
                                                      'LOGIN',
                                                      style: TextStyle(
                                                        fontSize: 16,
                                                        fontWeight:
                                                            FontWeight.w600,
                                                        color: Colors.white,
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        if (!isSmallScreen)
                          Expanded(
                            flex: 2,
                            child: Container(
                              decoration: const BoxDecoration(
                                image: DecorationImage(
                                  image: AssetImage('assets/images/login.jpeg'),
                                  fit: BoxFit.cover,
                                ),
                              ),
                              width: double.infinity,
                              height: constraints.maxHeight,
                            ),
                          ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  String? emailValidator(String? value) {
    if (value == null || value.isEmpty) {
      return 'Please enter your email';
    } else if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
      return 'Please enter a valid email';
    }
    return null;
  }

  Widget buildInputField(String label, TextEditingController controller,
      [String? Function(String?)? validator]) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.black87,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          decoration: InputDecoration(
            filled: true,
            // labelText: label,
            fillColor: Colors.white,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.black.withOpacity(0.1)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: BorderSide(color: Colors.black.withOpacity(0.1)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8),
              borderSide: const BorderSide(
                color: Color(0xFF4169E1),
                width: 2,
              ),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 14,
            ),
          ),
          validator: (value) {
            if (validator != null) return validator(value);
            if (value == null || value.isEmpty) {
              return 'This field is required';
            }
            return null;
          },
        ),
      ],
    );
  }
}
