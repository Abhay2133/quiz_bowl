import 'package:desktop/appstate.dart';
import 'package:desktop/utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:provider/provider.dart';
import 'package:shimmer/shimmer.dart';

class QuizInfo extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final quizState = context.watch<MyAppState>();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Quiz Bowl Challenge',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 32),
        buildDetailSection('Participant Name', quizState.userName),
        const SizedBox(height: 24),
        buildDetailSection('Team name', quizState.teamname),
        const SizedBox(height: 24),
        const Text(
          'Members',
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.black54,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          '${quizState.userName}',
          style: TextStyle(fontWeight: FontWeight.w500, fontSize: 16.0),
        ),
        Text(
          '${quizState.teammateName}',
          style: TextStyle(fontWeight: FontWeight.w500, fontSize: 16.0),
        ),
        const SizedBox(height: 24),
        buildDetailSection('Duration', '${quizState.duration} mins'),
        const SizedBox(height: 24),
        buildDetailSection('Timing', '${formatTime(quizState.datetime)}'),
        const SizedBox(height: 24),
        buildDetailSection('Date', '${formatDate(quizState.datetime)}'),
        const SizedBox(height: 24),
        buildDetailSection('Quizcode', '${quizState.quizcode}'),
      ],
    );
  }

  Widget buildDetailSection(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.black54,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}

class QuizInfoSkeleton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final quizState = context.watch<MyAppState>();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Quiz Bowl Challenge',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 32),
        skeleton("Participant Name", width: 200.0),
        skeleton("Team Name", width: 150.0),
        skeleton("Members", height: 60.0, width: 180.0),
        skeleton("Duration", width: 180.0),
        skeleton("Timing", width: 100.0),
        skeleton("Quizcode", width: 150.0)
        // buildDetailSection('Quizcode', '${quizState.quizcode}'),
      ],
    );
  }

  Widget skeleton(String label, {double height = 30.0, double width = 300.0}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.black54,
          ),
        ),
        const SizedBox(height: 4),
        Shimmer.fromColors(
            baseColor: Colors.blue[200]!.withOpacity(0.2),
            highlightColor: Colors.blue[100]!,
            child: Container(
                // color: Colors.white,
                height: height,
                width: width,
                decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(7.0)))),
        const SizedBox(height: 24)
      ],
    );
  }

  Widget label(String label) {
    return Text(
      label,
      style: const TextStyle(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: Colors.black54,
      ),
    );
  }

  Widget buildDetailSection(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: Colors.black54,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }
}

const _shimmerGradient = LinearGradient(
  colors: [
    Color(0xFFEBEBF4),
    Color(0xFF55F477),
    Color(0xFFEBEBF4),
  ],
  stops: [
    0.1,
    0.3,
    0.4,
  ],
  begin: Alignment(-1.0, -0.3),
  end: Alignment(1.0, 0.3),
  tileMode: TileMode.clamp,
);
