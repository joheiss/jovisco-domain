import {Contract} from './contract';
import {ReceiversEntity} from './receivers-entity';
import {InvoicesEntity} from './invoices-entity';
import {ContractSummaryData} from './contract-summary-data.model';
import {InvoiceFactory} from './invoice-factory';

export class ContractSummary {

    constructor(private _data: ContractSummaryData) {
    }

    get object(): Contract {
        return this._data.object;
    }

    get receiverName(): string {
        return this._data.receiverName;
    }

    get changeable(): boolean {
        return this._data.lastInvoiceId.length > 0;
    }

    get revenue(): number {
        return this._data.revenue;
    }

    get lastInvoiceId(): string {
        return this._data.lastInvoiceId
    }

    get data(): ContractSummaryData {
        this._data.changeable = this.changeable;
        return this._data;
    }

    setReceiverInfos(receivers: ReceiversEntity): ContractSummary {
        const receiver = receivers[this._data.object.header.customerId];
        this._data.receiverName = receiver.name;
        return this;
    }

    setInvoiceInfos(invoices: InvoicesEntity): ContractSummary {

        Object.keys(invoices)
            .filter(invoiceId => invoices[invoiceId].contractId === this._data.object.header.id)
            .forEach(invoiceId => {
                const invoice = InvoiceFactory.fromData(invoices[invoiceId]);
                // calculate revenue
                this._data.revenue = this._data.revenue + invoice.netValue;
                // get last invoice Id
                if (invoiceId > this._data.lastInvoiceId) {
                    this._data.lastInvoiceId = invoiceId;
                }
            });

        return this;
    }
}

