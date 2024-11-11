String formatTime(DateTime dateTime) {
  int hour = dateTime.hour % 12 == 0 ? 12 : dateTime.hour % 12;
  String minute = dateTime.minute.toString().padLeft(2, '0');
  String period = dateTime.hour >= 12 ? 'PM' : 'AM';
  
  return "$hour:$minute $period";
}
