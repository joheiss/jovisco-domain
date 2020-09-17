import {DateTime, Interval} from 'luxon';

export class DateUtility {

    public static addDaysToDate(date: Date, days: number): Date {
        return DateTime.fromJSDate(date).plus({days: days}).toJSDate();
    }

    public static subtractDaysFromDate(date: Date, days: number): Date {
        return DateTime.fromJSDate(date).minus({days: days}).toJSDate();
    }

    public static getCurrentDate(): Date {
        return DateTime.local().startOf('day').toJSDate();
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
        const start = DateTime.fromJSDate(startDate);
        const end = DateTime.fromJSDate(endDate);
        const duration = end.diff(start, 'days');
        return Math.ceil(duration.days);
    }

    public static getDateFromMoment(moment: any): Date {
        return this.momentToDateTimeUTC(moment).toJSDate();
    }

    public static getStartDateFromMoment(moment: any): Date {
        return this.momentToDateTimeUTC(moment)
            .startOf('day')
            .toJSDate();
    }

    public static getEndDateFromMoment(moment: any): Date {
        return this.momentToDateTimeUTC(moment)
            .endOf('day')
            .toJSDate();
    }

    public static getIntervalFromDates(from: Date, to: Date): Interval {
        return Interval.fromDateTimes(DateTime.fromJSDate(from), DateTime.fromJSDate(to));
    }

    private static momentToDateTimeUTC(moment: any): DateTime {
        return DateTime.fromMillis(moment.valueOf());
    }
}
