import {OpenInvoiceData} from './open-invoice-data.model';
import {Invoice} from '../invoicing';

export class OpenInvoice {

    public static createFromData(data: OpenInvoiceData): OpenInvoice {
        return new OpenInvoice(data);
    }

    public static mapFromInvoice(invoice: Invoice, receiverName: string): OpenInvoice {

        const data = {
            id: invoice.header.id,
            issuedAt: invoice.header.issuedAt,
            billingPeriod: invoice.header.billingPeriod,
            receiverId: invoice.header.receiverId,
            receiverName: receiverName,
            netValue: invoice.netValue,
            paymentAmount: invoice.paymentAmount,
            dueDate: invoice.dueDate
        } as OpenInvoiceData;

        return OpenInvoice.createFromData(data);
    }

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
