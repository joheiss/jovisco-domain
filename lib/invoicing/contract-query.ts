import {Contract} from './contract';
import {Invoice} from './invoice';
import {DocumentLink} from '../documents';

export class ContractQuery {

   constructor(private contract: Contract) {}

    getDocumentLinks(documentLinks: DocumentLink[]): DocumentLink[] {
        return documentLinks.filter(docLink => docLink.owner === this.contract.ownerKey);
    }

    getInvoices(invoices: Invoice[]): Invoice[] {
        return invoices.filter(invoice => invoice.header.contractId === this.contract.header.id);
    }

    getLastInvoice(invoices: Invoice[]): Invoice {
        return this.getInvoices(invoices).reduce((last, curr) => {
            if (last && last.header.id && curr.header.id && last.header.id >= curr.header.id) {
                return last;
            }
            return curr;
        });
    }

    static getActiveAndFutureContracts(contracts: Contract []): Contract[] {
        return contracts.filter(c => c.term.isActive || c.term.isFuture);
    }


    static getExpiredContracts(contracts: Contract []): Contract[] {
        return contracts.filter(c => c.term.isExpired);
    }

    static getInvoiceableContracts(contracts: Contract []): Contract[] {
        return contracts.filter(c => c.term.isInvoiceable);
    }

}
