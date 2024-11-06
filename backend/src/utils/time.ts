export function toIndianTime(isoDateString:string) {
  // Parse the input date string, assuming it's in the ISO format with a timezone offset
  const date = new Date(isoDateString);

  // Define IST offset in minutes (UTC+5:30)
  const IST_OFFSET = 5.5 * 60; // IST is UTC+5:30

  // Calculate the time difference from UTC to IST and adjust the date
  const indianTime = new Date(date.getTime() + IST_OFFSET * 60 * 1000);

  // Format to ISO string in IST timezone
  const isoStringInIST = indianTime.toISOString().replace('Z', '+05:30');
  return isoStringInIST;
}