import {Contract} from './contract';
import {ReceiversEntity} from './receivers-entity';
import {InvoicesEntity} from './invoices-entity';
import {Invoice} from './invoice';
import {ContractSummaryData} from './contract-summary-data.model';

export class ContractSummary {

    public static create(contract: Contract): ContractSummary {

        const data = {
            object: contract,
            receiverName: '',
            revenue: 0,
            changeable: false,
            lastInvoiceId: ''
        };

        return new ContractSummary(data);
    }

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

    public setReceiverInfos(receivers: ReceiversEntity): ContractSummary {
        const receiver = receivers[this._data.object.header.customerId];
        console.log('receiver: ', receiver);
        console.log('receiver.name: ', receiver.name);
        this._data.receiverName = receiver.name;
        return this;
    }

    public setInvoiceInfos(invoices: InvoicesEntity): ContractSummary {

        Object.keys(invoices)
            .filter(invoiceId => invoices[invoiceId].contractId === this._data.object.header.id)
            .forEach(invoiceId => {
                const invoice = Invoice.createFromData(invoices[invoiceId]);
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

