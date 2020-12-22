import {Invoice} from './invoice';
import {Contract} from './contract';
import {Receiver} from './receiver';
import {ContractQuery} from './contract-query';
import {DocumentLink} from '../documents';

export class ReceiverQuery {

    constructor(private receiver: Receiver) {}

    getContracts(contracts: Contract[]): Contract[] {
        return contracts.filter(contract => contract.header.customerId === this.receiver.header.id)
    }

    getDocumentLinks(documentLinks: DocumentLink[]): DocumentLink[] {
        return documentLinks.filter(docLink => docLink.owner === this.receiver.ownerKey);
    }

    getInvoices(invoices: Invoice[]): Invoice[] {
        return invoices.filter(invoice => invoice.header.receiverId === this.receiver.header.id);
    }

    getLastInvoice(invoices: Invoice[]): Invoice {
        return this.getInvoices(invoices).reduce((last, curr) => {
            if (last?.header.id && curr.header.id && last.header.id >= curr.header.id) return last;
            return curr;
        });
    }

    isQualifiedForQuickInvoice(contracts: Contract[]): boolean {
        return this.getContracts(ContractQuery.getInvoiceableContracts(contracts)).length === 1;
    }

}
