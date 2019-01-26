import {DateUtility} from '../utils';
import {DateTime} from 'luxon';

export class ContractTerm {

    constructor(private _startDate: Date, private _endDate: Date) {}

    get startDate(): Date {
        return this._startDate;
    }
    set startDate(date: Date) {
        this._startDate = DateUtility.getStartDate(date);
    }

    get endDate(): Date {
        return this._endDate;
    }
    set endDate(date: Date) {
        this._endDate = DateUtility.getEndDate(date);
    }

    get data(): { startDate: Date, endDate: Date } {
        return { startDate: this._startDate, endDate: this._endDate }
    }
    get isActive(): boolean {
        const today = new Date().getTime();
        return this.isValid && this._startDate.getTime() <= today && this._endDate.getTime() >= today;
    }
    get isExpired() {
        return this.isValid && this._endDate.getTime() < new Date().getTime();
    }
    get isFuture() {
        return this.isValid && this._startDate.getTime() > new Date().getTime();
    }
    get isInvoiceable() {
        const deadline = DateTime.fromJSDate(this._endDate).plus({days: 15}).toJSDate().getTime();
        const today = new Date().getTime();
        return this.isValid && this._startDate.getTime() <= today && deadline >= today;
    }
    get isValid(): boolean {
        return this._startDate && this._endDate && this._startDate.getTime() < this._endDate.getTime();
    }

    get durationDays(): number {
        return this.isValid ? DateUtility.getDurationInDays(this._startDate, this._endDate) : 0;
    }
    contains(date: Date): boolean {
        return this.isValid && this._startDate.getTime() <= date.getTime() && this._endDate.getTime() >= date.getTime();
    }
    isAfter(date: Date): boolean {
        return this.isValid && this._startDate.getTime() > date.getTime();
    }
    isBefore(date: Date): boolean {
        return this.isValid && this._endDate.getTime() < date.getTime();
    }
}
