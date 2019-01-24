import {Invoice} from './invoice';
import {ReceiversEntity} from './receivers-entity';
import {InvoiceStatus} from './invoice-status.model';
import {InvoiceSummaryData} from './invoice-summary-data.model';

export class InvoiceSummary {

    static create(invoice: Invoice): InvoiceSummary {

        const data = {
            object: invoice,
            receiverName: '',
            changeable: invoice.header.status === InvoiceStatus.created.valueOf()
        };

        return new InvoiceSummary(data);
    }

    private constructor(private _data: InvoiceSummaryData) {
    }

    get object(): Invoice {
        return this._data.object;
    }

    get receiverName(): string {
        return this._data.receiverName;
    }

    get changeable(): boolean {
        return this._data.changeable
    }

    get data(): InvoiceSummaryData {
        return this._data;
    }

    setReceiverInfos(receivers: ReceiversEntity): InvoiceSummary {
        this._data.receiverName = receivers[this._data.object.header.receiverId].name;
        return this;
    }
}
