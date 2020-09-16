import { Revenue, RevenueFactory } from '../lib/reporting';
import { inspect } from 'util';

describe('reporting tests', () => {
    it('should create a revenue object', () => {
        const currentYear = new Date().getFullYear();
        const revenue = mockRevenue(currentYear.toString());
        console.log('revenue :', inspect(revenue));
        expect(revenue).toBeTruthy();
        expect(revenue.totalRevenue).toBe(120000);
        expect(revenue.getTotalRevenueInMonth('1')).toBe(10000);
        expect(revenue.getTotalRevenueForReceiver('1901')).toBe(12000);
        const expected = {
            year: currentYear,
            revenuePerMonth: [
                10000,
                10000,
                10000,
                10000,
                10000,
                10000,
                10000,
                10000,
                10000,
                10000,
                10000,
                10000,
            ],
            revenuePerYear: 120000,
        };
        expect(Revenue.calculateTotalRevenuesPerYear([revenue])[0]).toEqual(
            expected
        );
    });

    it('should return a correct revenue period', () => {
        let date = new Date(2019, 0, 15);
        let expected = { year: 2018, month: 12 };
        expect(Revenue.calculateRevenuePeriod(date)).toEqual(expected);
        date = new Date(2019, 0, 16);
        expected = { year: 2019, month: 1 };
        expect(Revenue.calculateRevenuePeriod(date)).toEqual(expected);
    });
});

const mockRevenue = (year: string): Revenue => {
    const data = {
        $id: `${year}_GHQ`,
        id: year,
        organization: 'GHQ',
        months: {
            '1': { '1901': 1000.0, '1902': 9000.0 },
            '2': { '1901': 1000.0, '1902': 9000.0 },
            '3': { '1901': 1000.0, '1902': 9000.0 },
            '4': { '1901': 1000.0, '1902': 9000.0 },
            '5': { '1901': 1000.0, '1902': 9000.0 },
            '6': { '1901': 1000.0, '1902': 9000.0 },
            '7': { '1901': 1000.0, '1902': 9000.0 },
            '8': { '1901': 1000.0, '1902': 9000.0 },
            '9': { '1901': 1000.0, '1902': 9000.0 },
            '10': { '1901': 1000.0, '1902': 9000.0 },
            '11': { '1901': 1000.0, '1902': 9000.0 },
            '12': { '1901': 1000.0, '1902': 9000.0 },
        },
    };
    return RevenueFactory.fromData(data);
};
