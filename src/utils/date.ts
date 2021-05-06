export function formatDate(date: Date, withYear: boolean, withTime: boolean): string {
  let answer = '';
  if (withYear) {
    answer += `${getYear(date)}-`;
  }
  answer += `${getMonth(date)}-${getDay(date)}`;
  if (withTime) {
    answer += ` ${getHours(date)}:${getMinutes(date)}`;
  }
  return answer;
}

export function getTimestamp(date: Date): string {
  return `${getYear(date)}/${getMonth(date)}/${getDay(date)} ${getHoursAmPm(date)}:${getMinutes(date)}:${getSeconds(date)} ${getAmPm(date)} UTC+2`;
}

function getDay(date: Date): string {
  return addLeadingZero(date.getDate());
}

function getMonth(date: Date): string {
  const month = date.getMonth() + 1;
  return addLeadingZero(month);
}

function getYear(date: Date): string {
  return date.getFullYear().toString();
}

function getHours(date: Date): string {
  return addLeadingZero(date.getHours());
}

function getHoursAmPm(date: Date): string {
  let hours = date.getHours() % 12;
  hours = hours === 0 ? 12 : hours;
  return hours.toString();
}

function getMinutes(date: Date): string {
  return addLeadingZero(date.getMinutes());
}

function getSeconds(date: Date): string {
  return addLeadingZero(date.getSeconds());
}

function addLeadingZero(a: number): string {
  return a > 9 ? a.toString() : `0${a.toString()}`;
}

function getAmPm(date: Date): string {
  return date.getHours() >= 12 ? 'PM' : 'AM';
}
