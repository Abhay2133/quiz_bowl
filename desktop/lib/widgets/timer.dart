import 'dart:async';
import 'package:flutter/material.dart';

class CountdownTimer extends StatefulWidget {
  final DateTime time; // Starting value for the countdown

  CountdownTimer({required this.time});

  @override
  _CountdownTimerState createState() => _CountdownTimerState();
}

class _CountdownTimerState extends State<CountdownTimer> {
  late DateTime _initTime;
  late String _currentValue; // Current value of the countdown
  Timer? _timer; // Timer object

  @override
  void initState() {
    super.initState();
    _initTime = (widget.time);
    _currentValue = remainingTime(DateTime.now(), _initTime);
    _startCountdown();
  }

  void _startCountdown() {
    _timer = Timer.periodic(Duration(seconds: 1), (timer) {
      setState(() {
        if (DateTime.now().isBefore(_initTime)) {
          _currentValue = remainingTime(DateTime.now(), _initTime);
        } else {
          _timer?.cancel(); // Stop the timer when it reaches 0
        }
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel(); // Cancel the timer when the widget is disposed
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(
          color: Colors.grey.withOpacity(0.5),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Image.asset(
            "assets/images/timer.gif",
            height: 30,
            width: 30,
          ),
          Text(
            '$_currentValue',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

String remainingTime(DateTime dateTime1, DateTime dateTime2) {
  Duration difference = dateTime2.difference(dateTime1);

  // If the time difference is negative, return "00m : 00s"
  if (difference.isNegative) {
    return "Times up";
  }

  int days = difference.inDays;
  int hours = difference.inHours % 24;
  int minutes = difference.inMinutes % 60;
  int seconds = difference.inSeconds % 60;

  if (days > 0) {
    // Format: DDd : HHh
    return "${days}d : ${hours}h";
  } else if (hours > 0) {
    // Format: HHh : MMm
    return "${hours}h : ${minutes}m";
  } else {
    // Format: MMm : SSs
    return "${minutes}m : ${seconds}s";
  }
}

