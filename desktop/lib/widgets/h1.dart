import 'package:flutter/material.dart';

class H1 extends StatelessWidget {
  final String text;
  final double padding;

  const H1({super.key, required this.text, required this.padding});
  // const H1({super.key, required this.text, this.padding});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.all(padding),
      child: Text(text,
          style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold)),
    );
  }
}
