import {OpenInvoiceData} from './open-invoice-data.model';
import {Invoice} from '../invoicing';
import {OpenInvoice} from './open-invoice';

export class OpenInvoiceFactory {

    static fromData(data: OpenInvoiceData): OpenInvoice {
        return new OpenInvoice(data);
    }

    static fromDataArray(openInvoices: OpenInvoiceData []): OpenInvoice[] {
        return openInvoices.map(oi => OpenInvoiceFactory.fromData(oi));
    }

    static fromInvoice(invoice: Invoice, receiverName: string): OpenInvoice {
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
        return OpenInvoiceFactory.fromData(data);
    }
}
