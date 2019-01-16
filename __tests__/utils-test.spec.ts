import {DateUtility, difference} from '../lib/utils';
import {DateTime} from 'luxon';

describe('test date utility', () => {
    it('should return the correct date when adding days to a date', () => {
        const inputDate = DateTime.utc(2018, 1, 1).startOf('day').toJSDate();
        const expectedDate =  DateTime.utc(2019, 1, 1).startOf('day').toJSDate();
        expect(DateUtility.addDaysToDate(inputDate, 365)).toEqual(expectedDate);
    });

    it('should return the correct date when subtracting days from a date', () => {
        const inputDate = DateTime.utc(2019, 1, 1).startOf('day').toJSDate();
        const expectedDate =  DateTime.utc(2018, 12, 31).startOf('day').toJSDate();
        expect(DateUtility.subtractDaysFromDate(inputDate, 1)).toEqual(expectedDate);
    });

    it('should return a date with time is 00:00:00:000', () => {
        const inputDate = new Date(2019, 0, 1);
        const expectedDate = new Date(2019, 0, 1, 0, 0, 0, 0);
        expect(DateUtility.getStartDate(inputDate)).toEqual(expectedDate);
    });

    it('should return a date with time is 23:59:59:999', () => {
        const inputDate = new Date(2019, 0, 1);
        const expectedDate = new Date(2019, 0, 1, 23, 59, 59, 999);
        expect(DateUtility.getEndDate(inputDate)).toEqual(expectedDate);
    });

    it('should return a default start date - beginning of month, time: 00:00:00:000', () => {
        const date = new Date(2019, 0, 15);
        expect(DateUtility.getDefaultNextPeriodStartDate(date)).toEqual(new Date(2019, 1, 1, 0, 0, 0, 0));
    });

    it('should return a default end date - end of month, time: 23:59:59:999', () => {
        const date = new Date(2019, 0, 15);
        expect(DateUtility.getDefaultNextPeriodEndDate(date)).toEqual(new Date(2019, 3, 30, 23, 59, 59, 999));
    });

    it('should return a duration >= 89 days and <= 92 days', () => {
        const issuedAt = new Date(2019, 0, 15);
        const startDate = DateUtility.getDefaultNextPeriodStartDate(issuedAt);
        const endDate = DateUtility.getDefaultNextPeriodEndDate(issuedAt);
        expect(DateUtility.getDurationInDays(startDate, endDate)).toBeGreaterThanOrEqual(89);
        expect(DateUtility.getDurationInDays(startDate, endDate)).toBeLessThanOrEqual(92);
    });

    it('should return a time zone independent date', () => {
        const issuedAt = new Date(Date.UTC(2019, 0, 15));
        const moment = 1547938800000;
        const date1 = DateTime.fromMillis(moment);
        console.log('full date: ', date1.toISO());
        const date2 = DateUtility.getDateFromMoment(moment);
        console.log('issued at: ', DateTime.fromJSDate(date2).toISO());
        const date3 = DateUtility.getStartDateFromMoment(moment);
        console.log('start date: ', DateTime.fromJSDate(date3).toISO());
        const date4 = DateUtility.getEndDateFromMoment(moment);
        console.log('start date: ', DateTime.fromJSDate(date4).toISO());
        const locale = 'de-DE';
        const options = {
            timeZone: 'UTC'
        };
        console.log('Date: ', issuedAt.toLocaleDateString(locale, options));
        console.log('Date: ', issuedAt.toLocaleString(locale, options));
    });
});

describe('object utility tests', () => {
    it('should return the difference between two objects', () => {

        const base = {
            name: 'Hansi',
            age: 44,
            jobs: ['this', 'that'],
            stuff: {
                something: true,
                somethingElse: 'else'
            }
        };
        const changes = { name: 'Horsti' };
        const toBeCompared = {...base, ...changes };
        expect(difference(toBeCompared, base)).toEqual(changes);
    });

});
