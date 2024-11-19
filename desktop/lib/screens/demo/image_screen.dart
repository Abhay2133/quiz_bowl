import 'package:desktop/widgets/network_image.dart';
import 'package:flutter/material.dart';

class ImageDemo extends StatelessWidget {
  const ImageDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return const NetworkImageWidget(url: 'https://cdn.pixabay.com/photo/2022/11/10/20/29/snowman-7583640_1280.jpg');
  }

}