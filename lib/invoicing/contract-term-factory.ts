import {DateUtility} from '../utils';
import {DateTime} from "luxon";
import {ContractTerm} from './contract-term';

export class ContractTermFactory {

    static fromDates(startDate: Date, endDate: Date): ContractTerm {
        return new ContractTerm(DateUtility.getStartDate(startDate), DateUtility.getEndDate(endDate));
    }

    static nextDefaultTerm(date: Date): ContractTerm {
        const start = DateTime.fromJSDate(date).plus({ months: 1}).startOf('month').toJSDate();
        const end = DateTime.fromJSDate(start).plus({ months: 2}).endOf('month').toJSDate();
        return new ContractTerm(start, end);
    }
}
