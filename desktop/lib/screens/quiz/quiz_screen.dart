import 'package:flutter/material.dart';

class QuizScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Row(
        children: [
          Container(
              // color: Color(0xFFAAAAFF),
              width: 400.0,
              child: Column(
                children: [
                  SizedBox(
                    height: 20.0,
                  ),
                  Text(
                    "Quiz Bowl Challenge",
                    style: TextStyle(fontSize: 28.0),
                  )
                ],
              )),
          VerticalDivider(
            thickness: 2,
            color: Color(0xFFDDDDDD),
            width: 0.0,
          ),
          Expanded(
              child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                Padding(
                  padding: EdgeInsets.all(20.0),
                  child: Text(
                    "Questions",
                    style: TextStyle(fontSize: 22),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Card(
                    elevation: 5.0,
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 20.0, horizontal: 30.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text("Question - 1"),
                          SizedBox(height: 20,),
                          Text("In 1969, NASA's Apollo 11 mission achieved one of humanity's greatest accomplishments by successfully landing astronauts on the Moon. The mission involved a crew of three astronauts: Neil Armstrong, Buzz Aldrin, and Michael Collins. Armstrong was the first to step onto the lunar surface, famously declaring, \"That's one small step for man, one giant leap for mankind.\" This mission not only fulfilled President Kennedy's goal of reaching the Moon within the decade but also marked a major milestone in space exploration.Which of the following statements about the Apollo 11 mission is false?"),
                          SizedBox(height: 20,),
                          Text("Options")
                        ],
                      ),
                    ),
                  ),
                )
              ]))
        ],
      ),
    );
  }
}
