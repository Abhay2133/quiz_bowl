import 'package:flutter/material.dart';

class NetworkImageWidget extends StatelessWidget {
  final String url;
  const NetworkImageWidget({super.key, required this.url});

  @override
  Widget build(BuildContext context) {
    return Image.network(
      url, // Replace with your image URL
      loadingBuilder: (BuildContext context, Widget child,
          ImageChunkEvent? loadingProgress) {
        if (loadingProgress == null) {
          return child;
        } else {
          return Center(
            child: CircularProgressIndicator(
              value: loadingProgress.expectedTotalBytes != null
                  ? loadingProgress.cumulativeBytesLoaded /
                      (loadingProgress.expectedTotalBytes ?? 1)
                  : null,
            ),
          );
        }
      },
      errorBuilder:
          (BuildContext context, Object error, StackTrace? stackTrace) {
        return const Center(
          child: Text(
            'Failed to load image',
            style: TextStyle(color: Colors.red),
          ),
        );
      },
    );
  }
}
