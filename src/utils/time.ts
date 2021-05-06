export const TIME_FORMAT_REGEX = /^([0-6][0-9]|7[0-2]):([0-5][0-9]):([0-5][0-9])$/i;

export class Time {
  public hours = 0;
  public minutes = 0;
  public seconds = 0;
  public totalSeconds = 0;

  constructor(value?: string | number) {
    if (typeof value === 'string') {
      const matchArray = TIME_FORMAT_REGEX.exec(value);
      if (matchArray.length === 4) {
        this.hours = Number(matchArray[1]);
        this.minutes = Number(matchArray[2]);
        this.seconds = Number(matchArray[3]);
        this.totalSeconds = this.seconds + 60 * this.minutes + 3600 * this.hours;
      } else {
        throw new Error(`Invalid time format : ${value}`);
      }
    } else if (Number.isNaN(value) || value < 0 || value > 262799 || !Number.isInteger(value)) {
      throw new Error(`Invalid total number of seconds : ${value}`);
    } else {
      this.totalSeconds = value;
      let calc = value;
      this.hours = Math.floor(calc / 3600);
      calc %= 3600;
      this.minutes = Math.floor(calc / 60);
      this.seconds = calc % 60;
    }
  }

  public toString(): string {
    return `${this.hours}:${this.minutes}:${this.seconds}`;
  }
}
