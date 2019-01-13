import {DateUtility} from '../lib/utils/date-utility';
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
});
