import {OpenInvoiceData} from './open-invoice-data.model';

export class OpenInvoice {

    constructor(private _data: OpenInvoiceData) {}

    get data(): OpenInvoiceData {
        return this._data;
    }

    get id(): string {
        return this._data.id;
    }

    get issuedAt(): Date {
        return this._data.issuedAt;
    }

    get billingPeriod(): string {
        return this._data.billingPeriod;
    }

    get receiverId(): string {
        return this._data.receiverId;
    }

    get receiverName(): string {
        return this._data.receiverName;
    }

    get netValue(): number {
        return this._data.netValue;
    }

    get paymentAmount(): number {
        return this._data.paymentAmount;
    }

    get dueDate(): Date {
        return this._data.dueDate;
    }
}
