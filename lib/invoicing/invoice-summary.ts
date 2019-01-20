import {Summary} from './summary';
import {Invoice} from './invoice';
import {InvoicesEntity} from './invoices-entity';
import {ReceiversEntity} from './receivers-entity';
import {InvoiceStatus} from './invoice-status.model';

export interface InvoiceSummary extends Summary {
    object: Invoice;
    receiverName: string;
    changeable: boolean;
}

export type InvoiceSummariesType = {[id: string]: InvoiceSummary };

export class InvoiceSummaries {

    public static create(invoices: InvoicesEntity, receivers: ReceiversEntity): InvoiceSummariesType {

        const summaries = {} as InvoiceSummariesType;

        Object.keys(invoices)
            .forEach(invoiceId => {
                const receiver = receivers[invoices[invoiceId].receiverId];
                summaries[invoiceId] = {
                    object: Invoice.createFromData(invoices[invoiceId]),
                    receiverName: receiver ? receiver.name : 'Unbekannt',
                    changeable: invoices[invoiceId].status === InvoiceStatus.created.valueOf()
                };
            });

        return summaries;
    }
}
