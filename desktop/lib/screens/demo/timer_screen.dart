import 'package:desktop/widgets/timer.dart';
import 'package:flutter/material.dart';

class TimerScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
        appBar: AppBar(
          title: Text("COUNTDOWN TIMER"),
        ),
        body: CountdownTimer(
          time: DateTime.now().add(Duration(seconds: 1)),
          onFinish: () {
            
          },
        ));
  }
}
