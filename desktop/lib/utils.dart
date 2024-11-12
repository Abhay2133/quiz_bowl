String formatTime(DateTime dateTime) {
  int hour = dateTime.hour % 12 == 0 ? 12 : dateTime.hour % 12;
  String minute = dateTime.minute.toString().padLeft(2, '0');
  String period = dateTime.hour >= 12 ? 'PM' : 'AM';
  
  return "$hour:$minute $period";
}

String formatDate(DateTime date) {
  // List of month abbreviations
  const List<String> months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Get day, month abbreviation, and year
  String day = date.day.toString().padLeft(2, '0'); // Ensures two digits for day
  String month = months[date.month - 1]; // Get the month abbreviation
  String year = date.year.toString();

  return '$day $month, $year';
}
