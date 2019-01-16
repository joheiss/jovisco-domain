import {DateTime, Interval} from 'luxon';

export class DateUtility {

    public static addDaysToDate(date: Date, days: number): Date {
        return DateTime.fromJSDate(date).plus({days: days}).toJSDate();
    }

    public static subtractDaysFromDate(date: Date, days: number): Date {
        return DateTime.fromJSDate(date).minus({days: days}).toJSDate();
    }

    public static getCurrentDate(): Date {
        return DateTime.local().set({hour: 12, minute: 0, second: 0, millisecond: 0}).toJSDate();
    }

    public static getDefaultNextPeriodStartDate(date: Date = new Date()): Date {
        return DateTime.fromJSDate(date).plus({months: 1}).startOf('month').toJSDate();
    }

    public static getDefaultNextPeriodEndDate(date: Date = new Date()): Date {
        return DateTime.fromJSDate(date).plus({months: 3}).endOf('month').toJSDate();
    }

    public static getStartOfDay(date: Date = new Date()): Date {
        return DateTime.fromJSDate(date).startOf('day').toJSDate();
    }

    public static getEndOfDay(date: Date = new Date()): Date {
        return DateTime.fromJSDate(date).endOf('day').toJSDate();
    }

    public static getStartDate(date: Date = new Date()): Date {
        return DateTime.fromJSDate(date).startOf('day').toJSDate();
    }

    public static getEndDate(date: Date = new Date()): Date {
        return DateTime.fromJSDate(date).endOf('day').toJSDate();
    }

    public static getDurationInDays(startDate: Date, endDate: Date): number {
        const duration = Interval.fromDateTimes(
            DateTime.fromJSDate(startDate),
            DateTime.fromJSDate(endDate)
        );
        return Math.ceil(duration.length('days')) + 1;
    }

    public static getIssuedAtFromMoment(moment: any): Date {
        return DateTime.fromMillis(moment.valueOf())
            .setZone('UTC')
            .startOf('day')
            .toJSDate();
    }

    public static getStartDateFromMoment(moment: any): Date {
        return DateTime.fromMillis(moment.valueOf())
            .setZone('UTC')
            .startOf('day')
            .toJSDate();
    }

    public static getEndDateFromMoment(moment: any): Date {
        return DateTime.fromMillis(moment.valueOf())
            .setZone('UTC')
            .endOf('day')
            .toJSDate();
    }
}
