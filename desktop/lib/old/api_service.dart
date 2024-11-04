import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  final String baseUrl;
  final FlutterSecureStorage storage;

  ApiService({required this.baseUrl}) : storage = FlutterSecureStorage();

  Future<String?> login(String username, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'username': username, 'password': password}),
    );

    if (response.statusCode == 200) {
      final jsonResponse = jsonDecode(response.body);
      final token = jsonResponse['token'];
      await storage.write(key: 'jwt', value: token); // Store the token securely
      return token;
    } else {
      throw Exception('Failed to authenticate');
    }
  }

  Future<void> logout() async {
    await storage.delete(key: 'jwt'); // Delete the token securely
  }

  Future<String?> getToken() async {
    return await storage.read(key: 'jwt'); // Retrieve the token
  }

  Future<http.Response> fetchProtectedResource() async {
    final token = await getToken();
    final response = await http.get(
      Uri.parse('$baseUrl/protected-resource'),
      headers: {
        'Authorization': 'Bearer $token',
        'Content-Type': 'application/json',
      },
    );
    return response;
  }
}
