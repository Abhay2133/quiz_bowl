export function toIndianTime(utcDateString:string) {
  // Parse the UTC date string to a Date object
  const date = new Date(utcDateString);

  // Format the date to IST using Intl.DateTimeFormat
  const indiaTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'long'
  }).format(date);

  return indiaTime;
}