export const TIME_FORMAT_REGEX = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/i;

export class Time {
  public hours = 0;
  public minutes = 0;
  public seconds = 0;

  constructor(format?: string) {
    if (format) {
      const matchArray = TIME_FORMAT_REGEX.exec(format);
      if (matchArray.length === 4) {
        this.hours = Number(matchArray[1]);
        this.minutes = Number(matchArray[2]);
        this.seconds = Number(matchArray[3]);
      } else {
        throw new Error(`Invalid time format : ${format}`);
      }
    }
  }

  public isBefore(time: Time): boolean {
    return (
      this.hours < time.hours ||
      (this.hours === time.hours && this.minutes < time.minutes) ||
      (this.hours === time.hours && this.minutes === time.minutes && this.seconds < time.seconds)
    );
  }
}
