import {DateTime} from 'luxon';
import {ContractTerm} from '../lib/invoicing/contract-term';
import {ContractTermFactory} from '../lib/invoicing';

describe('contract term tests', () => {

    it('should create a valid contract term', () => {
        const start = DateTime.local().toJSDate();
        const end = DateTime.local().plus({months: 2}).endOf('month').toJSDate();
        const term = ContractTermFactory.fromDates(start, end);
        expect(term).toBeTruthy();
        expect(term.isValid).toBeTruthy();
    });

    it('should create an invalid contract term', () => {
        const start = DateTime.local().toJSDate();
        const end = DateTime.local().plus({months: 2}).endOf('month').toJSDate();
        const term = ContractTermFactory.fromDates(end, start);
        expect(term).toBeTruthy();
        expect(term.isValid).toBeFalsy();
    });

    it('should create an valid contract term of 1 day', () => {
        const start = DateTime.local().toJSDate();
        const end = DateTime.local().toJSDate();
        const term = ContractTermFactory.fromDates(start, end);
        expect(term).toBeTruthy();
        expect(term.isValid).toBeTruthy();
        expect(term.durationDays).toBe(1);
    });

    it('should create a valid next default contract term of 3 months, start at beginning of next month', () => {
        const today = new Date();
        const term = ContractTermFactory.nextDefaultTerm(today);
        expect(term).toBeTruthy();
        expect(term.isValid).toBeTruthy();
        expect(term.durationDays).toBeGreaterThanOrEqual(89);
        expect(term.durationDays).toBeLessThanOrEqual(92);
        expect(term.startDate.getDate()).toEqual(1);
        expect(term.isAfter(today)).toBeTruthy();
    });

    describe('test getters and setters', () => {
        let today: Date;
        let term: ContractTerm;

        beforeEach(() => {
            today = new Date();
            term = ContractTermFactory.fromDates(today, today);
        });

        it('should set the start date to local time 00:00:00:000 and the end date to 23:59:59:000', () => {
            const aDay = new Date(today.setHours(12, 1, 2, 333));
            const term = ContractTermFactory.fromDates(aDay, aDay);
            expect(term).toBeTruthy();
            expect(term.isValid).toBeTruthy();
            expect(term.startDate).toEqual(DateTime.fromJSDate(aDay).startOf('day').toJSDate());
            expect(term.endDate).toEqual(DateTime.fromJSDate(aDay).endOf('day').toJSDate());
            term.startDate = new Date(today.setHours(7, 8, 9, 111));
            expect(term.isValid).toBeTruthy();
            expect(term.startDate).toEqual(DateTime.fromJSDate(today).startOf('day').toJSDate());
            term.endDate = new Date(today.setHours(8, 9, 10, 222));
            expect(term.isValid).toBeTruthy();
            expect(term.endDate).toEqual(DateTime.fromJSDate(today).endOf('day').toJSDate());
        });

        it('shoud return an object containing start and end date', () => {
            const expected = {
                startDate: DateTime.fromJSDate(today).startOf('day').toJSDate(),
                endDate: DateTime.fromJSDate(today).endOf('day').toJSDate()
            };
            expect(term.data).toEqual(expected);
        });

        it('should return true for isActive, if term is active today, otherwise false', () => {
            expect(term.isActive).toBeTruthy();
            expect(term.isExpired).toBeFalsy();
            expect(term.isFuture).toBeFalsy();
            expect(term.isInvoiceable).toBeTruthy();
            const start = DateTime.local().plus({months: 1}).toJSDate();
            const futureTerm = ContractTermFactory.fromDates(start, start);
            expect(futureTerm.isActive).toBeFalsy();
            expect(futureTerm.isExpired).toBeFalsy();
            expect(futureTerm.isFuture).toBeTruthy();
            expect(futureTerm.isInvoiceable).toBeFalsy();
        });

        it('should return true for isExpired, if term ended before today', () => {
            const start = DateTime.local().minus({months: 1}).toJSDate();
            const expiredTerm = ContractTermFactory.fromDates(start, start);
            expect(expiredTerm.isExpired).toBeTruthy();
            expect(expiredTerm.isActive).toBeFalsy();
            expect(expiredTerm.isFuture).toBeFalsy();
            expect(expiredTerm.isInvoiceable).toBeFalsy();
        });

        it('should return true for isFuture, if term starts after today', () => {
            const start = DateTime.local().plus({months: 1}).toJSDate();
            const futureTerm = ContractTermFactory.fromDates(start, start);
            expect(futureTerm.isExpired).toBeFalsy();
            expect(futureTerm.isActive).toBeFalsy();
            expect(futureTerm.isFuture).toBeTruthy();
            expect(futureTerm.isInvoiceable).toBeFalsy();
        });

        it('should return true for isInvoiceable, if term is active or end of term has expired no onger than 15 days ago', () => {
            let start = DateTime.local().minus({months: 1}).startOf('month').toJSDate();
            let end = DateTime.local().endOf('month').toJSDate();
            const invoiceableTerm = ContractTermFactory.fromDates(start, end);
            expect(invoiceableTerm.isExpired).toBeFalsy();
            expect(invoiceableTerm.isActive).toBeTruthy();
            expect(invoiceableTerm.isFuture).toBeFalsy();
            expect(invoiceableTerm.isInvoiceable).toBeTruthy();
            invoiceableTerm.endDate = DateTime.local().minus({ days: 15 }).toJSDate();
            expect(invoiceableTerm.isExpired).toBeTruthy();
            expect(invoiceableTerm.isActive).toBeFalsy();
            expect(invoiceableTerm.isFuture).toBeFalsy();
            expect(invoiceableTerm.isInvoiceable).toBeTruthy();
            invoiceableTerm.endDate = DateTime.local().minus({ days: 16 }).toJSDate();
            expect(invoiceableTerm.isInvoiceable).toBeFalsy();
        });

        it('should return true if date is contained in term, false if not', () => {
            expect(term.contains(new Date())).toBeTruthy();
            const tomorrow = DateTime.local().plus({ days: 1}).startOf('day').toJSDate();
            expect(term.contains(tomorrow)).toBeFalsy();
        });

        it('should return true if term starts after date, false if not', () => {
            const yesterday = DateTime.local().minus({ days: 1}).endOf('day').toJSDate();
            const tomorrow = DateTime.local().plus({ days: 1}).startOf('day').toJSDate();
            expect(term.isAfter(yesterday)).toBeTruthy();
            expect(term.isAfter(new Date())).toBeFalsy();
            expect(term.isAfter(tomorrow)).toBeFalsy();
        });

        it('should return true if term ends before date, false if not', () => {
            const yesterday = DateTime.local().minus({ days: 1}).endOf('day').toJSDate();
            const tomorrow = DateTime.local().plus({ days: 1}).startOf('day').toJSDate();
            expect(term.isBefore(yesterday)).toBeFalsy();
            expect(term.isBefore(new Date())).toBeFalsy();
            expect(term.isBefore(tomorrow)).toBeTruthy();
        });
    });
});
