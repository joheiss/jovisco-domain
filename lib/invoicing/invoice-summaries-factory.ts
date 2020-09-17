import {InvoicesEntity} from './invoices-entity';
import {ReceiversEntity} from './receivers-entity';
import {InvoiceSummaryData} from './invoice-summary-data.model';
import {InvoiceSummaryFactory} from './invoice-summary-factory';
import {InvoiceFactory} from './invoice-factory';

export type InvoiceSummariesData = { [id: string]: InvoiceSummaryData };

export class InvoiceSummariesFactory {

    static fromEntities(receivers: ReceiversEntity, invoices: InvoicesEntity): InvoiceSummariesData {

        const summaries = {} as InvoiceSummariesData;

        Object.keys(invoices).forEach(invoiceId => {
            summaries[invoiceId] = InvoiceSummaryFactory
                .fromInvoice(InvoiceFactory.fromData(invoices[invoiceId]))
                .setReceiverInfos(receivers)
                .data;
        });
        return summaries;
    }
}
