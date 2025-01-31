import { format, setDate, setDay } from "date-fns";

export class DateLibs {
  static formatDate = (day: number) => {
    const date = new Date();

    return format(setDate(date, day), "do");
  };

  static WEEK_DAYS = [1, 2, 3, 4, 5, 6, 7];
  static formatDay = (day: number, formatStr: string = "EEE") => {
    const date = new Date();
    return format(setDay(date, day), formatStr);
  };

  static formatBeforeDays = (days: number) => {
    const formatted = String(days).padStart(2, "0");

    if (days === 1) {
      return `${formatted} day`;
    } else {
      return `${formatted} days`;
    }
  };
}
