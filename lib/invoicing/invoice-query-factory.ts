import {Invoice} from './invoice';
import {InvoiceQuery} from './invoice-query';

export class InvoiceQueryFactory {

    static fromInvoice(invoice: Invoice): InvoiceQuery {
        return new InvoiceQuery(invoice);
    }

}
