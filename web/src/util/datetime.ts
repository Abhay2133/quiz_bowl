export function formatISODate(isoDate: string): string {
  const date = new Date(isoDate);

  // Extract the day, month (as full name), hour, and minute
  const day = String(date.getDate()).padStart(2, '0'); // Ensure two-digit day
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const month = months[date.getMonth()]; // Get full month name
  const hour = date.getHours();
  const minute = String(date.getMinutes()).padStart(2, '0'); // Ensure two-digit minute

  // Determine AM/PM
  const ampm = hour >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  const hour12 = hour % 12 || 12; // Converts hour to 12-hour format, 0 becomes 12

  // Return the formatted string in "DD/month, HH:MM AM/PM" format
  return `${day} ${month}, ${hour12}:${minute} ${ampm}`;
}

export function convertToISODateTime(time: string): string {
  // Regular expression to match the time format HH:MM AM/PM
  const timePattern = /^(0[1-9]|1[0-2]|[1-9]):([0-5][0-9])\s?(AM|PM)$/i;
  const match = timePattern.exec(time);

  if (!match) {
    throw new Error("Invalid time format. Please use HH:MM AM/PM.");
  }

  // Extract hour, minute and period from the matched groups
  let hour = parseInt(match[1]);
  const minute = parseInt(match[2]);
  const period = match[3].toUpperCase();

  // Convert hour to 24-hour format
  if (period === 'PM' && hour < 12) {
    hour += 12;
  } else if (period === 'AM' && hour === 12) {
    hour = 0; // Midnight case
  }

  // Get the current date to create a full datetime
  const now = new Date();
  const isoDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);

  // Return the ISO string
  return isoDateTime.toISOString();
}

export function convertToISODate(dateStr: string): string {
  // Regular expression to match the date format DD/MM/YYYY
  const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
  const match = datePattern.exec(dateStr);
  
  if (!match) {
      throw new Error("Invalid date format. Please use DD/MM/YYYY.");
  }

  // Extract day, month, and year from the matched groups
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1; // Month is 0-indexed in JavaScript Date
  const year = parseInt(match[3], 10);

  // Create a new Date object
  const dateObject = new Date(year, month, day);

  // Check for invalid date
  if (dateObject.getDate() !== day || dateObject.getMonth() !== month || dateObject.getFullYear() !== year) {
      throw new Error("Invalid date provided. Please ensure the date exists.");
  }

  // Return the ISO string
  return dateObject.toISOString();
}

export function convertIsoToDate(isoDatetime: string): string {
  const date = new Date(isoDatetime);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function convertIsoToTime(isoDatetime: string): string {
  const date = new Date(isoDatetime);
  let hours = date.getHours();
  let minutes:any = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert 24-hour time to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 should be 12
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutes} ${ampm}`;
}

