import {Invoice} from './invoice';
import {InvoicesEntity} from './invoices-entity';
import {ReceiversEntity} from './receivers-entity';
import {InvoiceSummaryData} from './invoice-summary-data.model';
import {InvoiceSummary} from './invoice-summary';

export type InvoiceSummariesData = {[id: string]: InvoiceSummaryData };

export class InvoiceSummaries {

    public static create(receivers: ReceiversEntity, invoices: InvoicesEntity): InvoiceSummariesData {

        const summaries = {} as InvoiceSummariesData;

        Object.keys(invoices)
            .forEach(invoiceId => {
                summaries[invoiceId] = InvoiceSummary.create(Invoice.createFromData(invoices[invoiceId]))
                    .setReceiverInfos(receivers)
                    .data;
            });

        return summaries;
    }
}
