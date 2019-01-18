import {RevenueData} from './revenue-data.model';
import {RevenuePerYearData} from './revenue-per-year-data.model';
import {DateTime} from 'luxon';

export class Revenue {

    public static createFromData(data: RevenueData): Revenue {
        return new Revenue(data);
    }

    public static calculateTotalRevenuesPerYear(revenues: Revenue[]): RevenuePerYearData[] {

        const revenueMatrix = Revenue.initializeRevenuePerYear();

        revenues.map(r => {
            const i = Revenue.calculateIndexOfRevenueYear(+r.year);
            revenueMatrix[i].revenuePerYear = r.totalRevenue;
            r.revenueInMonths.map((m, j) => revenueMatrix[i].revenuePerMonth[j] = m);
            return revenueMatrix;
        });

        return revenueMatrix;
    }

    public static calculateRevenuePeriod(date: Date): { year: number, month: number } {
        const dt = DateTime.fromJSDate(date);
        if (dt.day > 15) {
            return { year: dt.year, month: dt.month };
        }
        const prev = dt.minus({months: 1});
        return {year: prev.year, month: prev.month};
    }

    private static calculateIndexOfRevenueYear(year: number): number {
        return DateTime.local().year - year;
    }

    private static initializeRevenuePerYear(): RevenuePerYearData[] {

        const revenuesPerYear = [] as RevenuePerYearData[];

        for (let i = 0; i < 3; i++) {
            const revenuePerYear: RevenuePerYearData = {
                year: DateTime.local().year - i,
                revenuePerMonth: new Array(12).fill(0),
                revenuePerYear: 0
            };
            revenuesPerYear.push(revenuePerYear);
        }
        return revenuesPerYear;
    }

    constructor(private data: RevenueData) {
    }

    get year(): string {
        return this.data.id || '';
    }

    get revenueInMonths(): number[] {
        const valuesPerMonth = new Array(12).fill(0);
        Object.keys(this.data.months).forEach(month => valuesPerMonth[+month - 1] = this.getTotalRevenueInMonth(month));
        return valuesPerMonth;
    }

    get totalRevenue(): number {
        let total = 0;
        Object.keys(this.data.months).forEach(month => {
            total = total + this.getTotalRevenueInMonth(month);
        });
        return total;
    }

    getTotalRevenueInMonth(month: string): number {
        if (!this.data.months[month]) {
            return 0;
        }
        let total = 0;
        Object.keys(this.data.months[month]).forEach(receiver => total = total + this.data.months[month][receiver]);
        return total;
    }

    getTotalRevenueForReceiver(receiver: string): number {
        let total = 0;
        Object.keys(this.data.months).forEach(month => {
            total = total + this.getTotalRevenueInMonthForReceiver(receiver, month);
        });
        return total;
    }

    getTotalRevenueInMonthForReceiver(receiver: string, month: string): number {
        let total = 0;
        if (!this.data.months[month]) {
            return 0;
        }
        Object.keys(this.data.months[month])
            .filter(recv => recv === receiver)
            .forEach(recv => total = total + this.data.months[month][recv] || 0);
        return total;
    }

}
