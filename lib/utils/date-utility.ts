import {DateTime} from 'luxon';

export class DateUtility {

    public static addDaysToDate(date: Date, days: number): Date {
        return DateTime.fromJSDate(date).plus({days: days}).toJSDate();
    }

    public static subtractDaysFromDate(date: Date, days: number): Date {
        return DateTime.fromJSDate(date).minus({days: days}).toJSDate();
    }

    public static getStartDate(date: Date = new Date()): Date {
        return DateTime.fromJSDate(date).startOf('day').toJSDate();
       // set({ hour: 0, minute: 0, second: 0, millisecond: 0}).toJSDate();
    }

    public static getEndDate(date: Date = new Date()): Date {
        return DateTime.fromJSDate(date).endOf('day').toJSDate();
        // set({ hour: 23, minute: 59, second: 59, millisecond: 999}).toJSDate();
    }
}
