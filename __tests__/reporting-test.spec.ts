import {Revenue, RevenueFactory} from '../lib/reporting';
import {inspect} from 'util';

describe('reporting tests', () => {
    it('should create a revenue object', () => {
        const revenue = mockRevenue('2019');
        console.log('revenue :', inspect(revenue));
        expect(revenue).toBeTruthy();
        expect(revenue.totalRevenue).toBe(120000);
        expect(revenue.getTotalRevenueInMonth('1')).toBe(10000);
        expect(revenue.getTotalRevenueForReceiver('1901')).toBe(12000);
        const expected = {
            year: 2019,
            revenuePerMonth: [10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000, 10000],
            revenuePerYear: 120000
        };
        expect(Revenue.calculateTotalRevenuesPerYear([revenue])[0]).toEqual(expected);
    });

    it('should return a correct revenue period', () => {
        let date = new Date(2019, 0, 15);
        let expected = { year: 2018, month: 12};
        expect(Revenue.calculateRevenuePeriod(date)).toEqual(expected);
        date = new Date(2019, 0, 16);
        expected = { year: 2019, month: 1};
        expect(Revenue.calculateRevenuePeriod(date)).toEqual(expected);
    });
});

const mockRevenue = (year: string): Revenue => {
    const data = {
        $id: `${year}_GHQ`,
        id: year,
        organization: 'GHQ',
        months: {
            '1': { '1901': 1000.00, '1902': 9000.00 },
            '2': { '1901': 1000.00, '1902': 9000.00 },
            '3': { '1901': 1000.00, '1902': 9000.00 },
            '4': { '1901': 1000.00, '1902': 9000.00 },
            '5': { '1901': 1000.00, '1902': 9000.00 },
            '6': { '1901': 1000.00, '1902': 9000.00 },
            '7': { '1901': 1000.00, '1902': 9000.00 },
            '8': { '1901': 1000.00, '1902': 9000.00 },
            '9': { '1901': 1000.00, '1902': 9000.00 },
            '10': { '1901': 1000.00, '1902': 9000.00 },
            '11': { '1901': 1000.00, '1902': 9000.00 },
            '12': { '1901': 1000.00, '1902': 9000.00 }
        }
    };
    return RevenueFactory.fromData(data);
};
