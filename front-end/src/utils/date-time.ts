const dateFormat = /\d\d\d\d-\d\d-\d\d/;
const timeFormat = /\d\d:\d\d/;

/**
 * Formats a Date object as YYYY-MM-DD.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

/**
 * Format a date string in ISO-8601 format as YYYY-MM-DD.
 * @param {string} dateString - The date string to format.
 * @returns {string} The formatted date string.
 */
export function formatAsDate(dateString) {
  return dateString.match(dateFormat)[0];
}

/**
 * Format a time string in HH:MM:SS format as HH:MM.
 * @param {string} timeString - The time string to format.
 * @returns {string} The formatted time string.
 */
export function formatAsTime(timeString) {
  return timeString.match(timeFormat)[0];
}

/**
 * Today's date as YYYY-MM-DD.
 * @returns {string} The formatted date string.
 */
export function today() {
  return asDateString(new Date());
}

/**
 * Subtracts one day from the specified date.
 * @param {string} currentDate - The current date in YYYY-MM-DD format.
 * @returns {string} The date one day prior, formatted as YYYY-MM-DD.
 */
export function previous(currentDate) {
  let [year, month, day] = currentDate.split("-");
  month -= 1;
  const date = new Date(year, month, day);
  date.setDate(date.getDate() - 1);
  return asDateString(date);
}

/**
 * Adds one day to the specified date.
 * @param {string} currentDate - The current date in YYYY-MM-DD format.
 * @returns {string} The date one day after, formatted as YYYY-MM-DD.
 */
export function next(currentDate) {
  let [year, month, day] = currentDate.split("-");
  month -= 1;
  const date = new Date(year, month, day);
  date.setDate(date.getDate() + 1);
  return asDateString(date);
}
