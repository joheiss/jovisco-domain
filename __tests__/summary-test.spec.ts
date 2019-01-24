import {mockContractSummaries} from './mock-contract.factory';
import {mockInvoiceSummaries} from './mock-invoice.factory';
import {mockReceiverSummaries} from './mock-receiver.factory';

describe('contract summary test', () => {

    it('should return an array of 10 summaries', () => {
        const summaries = mockContractSummaries();
        expect(summaries).toBeTruthy();
        expect(Object.keys(summaries)).toHaveLength(10);
        expect(summaries['4901']).toBeTruthy();
        expect(summaries['4901'].object).toBeTruthy();
        expect(summaries['4910']).toBeTruthy();
        expect(summaries['4910'].object).toBeTruthy();
    });
});

    describe('invoice summary test', () => {

        it('should return an array of 72 to 96 summaries', () => {
            const summaries = mockInvoiceSummaries();
            expect(summaries).toBeTruthy();
            expect(Object.keys(summaries).length).toBeGreaterThanOrEqual(72);
            expect(Object.keys(summaries).length).toBeLessThanOrEqual(96);
            expect(summaries['5901']).toBeTruthy();
            expect(summaries['5901'].object).toBeTruthy();
            expect(summaries['5972']).toBeTruthy();
            expect(summaries['5972'].object).toBeTruthy();
        });
});

describe('receiver summary test', () => {

    it('should return an array of 2 summaries', () => {
        const summaries = mockReceiverSummaries();
        expect(summaries).toBeTruthy();
        expect(Object.keys(summaries)).toHaveLength(2);
        expect(summaries['1901']).toBeTruthy();
        expect(summaries['1901'].object).toBeTruthy();
        expect(summaries['1902']).toBeTruthy();
        expect(summaries['1902'].object).toBeTruthy();
    });
});

