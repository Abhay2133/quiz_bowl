import 'package:desktop/appstate.dart';
import 'package:desktop/screens/rounds/rounds_screen.dart';
import 'package:desktop/screens/submission/submission_screen.dart';
import 'package:desktop/widgets/timer.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:scrollable_positioned_list/scrollable_positioned_list.dart';

class QuizQuestionScreen extends StatelessWidget {
  final int roundId;
  final ItemScrollController itemScrollController = ItemScrollController();

  QuizQuestionScreen({super.key, this.roundId = 1});

  void _scrollToIndex(int index) {
    itemScrollController.scrollTo(
      index: index,
      duration: Duration(milliseconds: 500),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    final appState = context.watch<MyAppState>();
    Round currentRound =
        appState.rounds.firstWhere((Round round) => (round.id == roundId));

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
          child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            width: 400.0,
            color: const Color(0xFFEFEFFF),
            padding: const EdgeInsets.all(20.0),
            child:
                SingleChildScrollView(child: sidePanel(context, currentRound)),
          ),

          // Timer + Questions
          Expanded(
              child: Container(
            // color: Colors.orange,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                //Timer
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: CountdownTimer(
                      time: appState.startTime
                          .add(Duration(minutes: appState.duration)),
                      onFinish: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => SubmissionScreen()));
                      },
                    ),
                  ),
                ),

                // Questions Heading
                const Padding(
                  padding:
                      EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
                  child: Text("Questions",
                      style: TextStyle(
                          fontSize: 20.0, fontWeight: FontWeight.w400)),
                ),
                SizedBox(height: 20.0),
                Expanded(child: qList(currentRound.questions))
              ],
            ),
          ))
        ],
      )),
    );
  }

  Widget qList(List<Question> questions) {
    return Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
        child: ScrollablePositionedList.builder(
            itemCount: questions.length,
            itemScrollController: itemScrollController,
            itemBuilder: (context, index) => QuestionCard(
                index: index + 1, question: questions[index], roundId: roundId))
        // child: Column(
        //     children: List.generate(
        //         questions.length,
        //         (index) => QuestionCard(
        //             index: index + 1,
        //             question: questions[index],
        //             roundId: roundId))),
        );
  }

  // Widget quesitonUI(){
  //   return
  // }

  Widget sidePanel(BuildContext context, Round currentRound) {
    final appState = Provider.of<MyAppState>(context, listen:false);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // back + header
        Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            IconButton(
              icon: Icon(Icons.arrow_back),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const RoundsScreen(),
                  ),
                );
              },
            ),
            SizedBox(width: 10.0),
            Text(currentRound.name, style: TextStyle(fontSize: 24.0))
          ],
        ),

        SizedBox(
          height: 20.0,
        ),
        // Info Section
        Padding(
          padding: const EdgeInsets.only(left: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Questions Index',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 16),
              indexUI(currentRound),
              const SizedBox(height: 5),
              Text(
                'Answered: ${currentRound.answers.length} / ${currentRound.questions.length}',
                style: TextStyle(
                    fontWeight: FontWeight.w500, color: Color(0xFF333333)),
              ),
              const SizedBox(height: 16),
              _InfoRow(title: 'Participant Name', value: appState.userName ),
              const SizedBox(height: 8),
              _InfoRow(title: 'Team Name', value: appState.teamname),
            ],
          ),
        ),
      ],
    );
  }

  Widget indexUI(Round currentRound) {
    return Container(
      width: 380.0,
      padding: EdgeInsets.all(10.0),
      decoration: BoxDecoration(
          color: Colors.white, borderRadius: BorderRadius.circular(10.0)),
      child: Center(
        child: Wrap(
          // alignment: WrapAlignment.start,
          direction: Axis.horizontal,
          // spacing: 10.0,
          children: [
            ...List.generate(
                currentRound.questions.length,
                (index) => Padding(
                    padding: const EdgeInsets.all(5.0),
                    child: Container(
                      width: 50.0,
                      child: TextButton(
                        style: TextButton.styleFrom(
                          foregroundColor: Colors.black,
                          backgroundColor: currentRound.answers
                                  .containsKey(currentRound.questions[index].id)
                              ? Colors.blue[100]
                              : Colors.white, // Text color
                          // fixedSize: const Size(30,30), // Set width and height to 30
                          side: BorderSide(
                              color: Colors.black.withOpacity(0.7),
                              width: 1.0), // Black border
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(
                                800.0), // Optional: rounded corners
                          ),
                        ),
                        onPressed: () {
                          // Define your onPressed action here
                          _scrollToIndex(index);
                        },
                        child: Text(
                            '${index + 1}'), // Empty text or icon as needed
                      ),
                    ))),
          ],
        ),
      ),
    );
  }
}

class QuestionCard extends StatelessWidget {
  final int index;
  final Question question;
  final int roundId;

  const QuestionCard(
      {super.key,
      required this.index,
      required this.question,
      required this.roundId});

  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    final appState = context.watch<MyAppState>();
    List<String> options = [
      question.option1,
      question.option2,
      question.option3,
      question.option4
    ];

    return Card(
      elevation: 2,
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: const BorderSide(
          color: Colors.grey,
          width: 0.5,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Question - ${index}',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 16),
            Padding(
              padding:
                  const EdgeInsets.symmetric(vertical: 8.0, horizontal: 15.0),
              child: Text(
                question.question,
                style: TextStyle(fontSize: 16.0),
              ),
            ),
            const SizedBox(height: 16),

            // Options
            // ...List.generate(
            //   4,
            //   (index) => RadioListTile<int>(
            //     title: Text('Option ${index + 1}'),
            //     value: index,
            //     groupValue: null,
            //     onChanged: (value) {},
            //     contentPadding: EdgeInsets.zero,
            //   ),
            // ),

            ...List.generate(
                options.length,
                (index) => ListTile(
                      title: Text(options[index]),
                      leading: Radio<int>(
                        value: index + 1,
                        groupValue: appState.rounds
                            .firstWhere((round) => round.id == roundId)
                            .answers[question.id],
                        onChanged: (value) {
                          appState.setAnswer(roundId, question.id, index + 1);
                        },
                      ),
                    )),

            // ...List.generate(4, (optionIndex) {
            //   final optionNumber = optionIndex + 1;
            //   return ListTile(
            //     title: Text(widget.options[optionIndex]),
            //     leading: Radio<int>(
            //       value: optionNumber,
            //       groupValue:
            //           answer, //appState.selectedAnswers[question.questionId],
            //       onChanged: (value) {
            //         // setState(() {
            //         //   answer = value!;
            //         // });
            //         // appState.setAnswer(question.questionId, optionNumber);
            //       },
            //     ),
            //   );
            // }),

            const SizedBox(height: 8),

            // Reset Button
            ElevatedButton(
              onPressed: () {
                appState.removeAnswer(roundId, question.id);
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.black87,
                foregroundColor: Colors.white,
              ),
              child: const Text('Reset'),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  final String title;
  final String value;

  const _InfoRow({
    required this.title,
    required this.value,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(
            fontSize: 14,
            color: Colors.grey,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}
