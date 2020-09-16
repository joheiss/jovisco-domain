import {Invoice} from './invoice';
import {InvoiceStatus} from './invoice-status.model';
import {InvoiceSummary} from './invoice-summary';

export class InvoiceSummaryFactory {

    static fromInvoice(invoice: Invoice): InvoiceSummary {

        const data = {
            object: invoice,
            receiverName: '',
            changeable: invoice.header.status === InvoiceStatus.created
        };
        return new InvoiceSummary(data);
    }
}
