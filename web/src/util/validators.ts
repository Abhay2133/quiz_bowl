import { convertToISODate, convertToISODateTime } from "./datetime";

export function isValidTime(time: string) {
  let isValid = true;
  try {
    convertToISODateTime(time);
  } catch (e) {
    isValid = false
  }
  return isValid;
}

export function isValidDate(date: string) {
  let isValid = true;
  try {
    convertToISODate(date);
  } catch (e) {
    isValid = false
  }
  return isValid;
}

export function isNumber(value: string): boolean {
  let isValid = true;
  try {
    parseInt('value');
  } catch (e) {
    isValid = false;
  }
  return isValid;
}