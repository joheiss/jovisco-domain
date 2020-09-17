import {Invoice} from './invoice';
import {Receiver} from './receiver';
import {Contract} from './contract';
import {ContractQuery} from './contract-query';
import {DocumentLink, DocumentLinkType} from '../documents';
import {InvoiceStatus} from './invoice-status.model';

export class InvoiceQuery {

    constructor(private invoice: Invoice) {
    }

    getContract(contracts: Contract[]): Contract | undefined {
        return contracts.find(contracts => contracts.header.id === this.invoice.header.contractId);
    }

    getDocumentLinks(documentLinks: DocumentLink[]): DocumentLink[] {
        return documentLinks.filter(docLink => docLink.owner === this.invoice.ownerKey);
    }

    getReceiver(receivers: Receiver[]): Receiver | undefined {
        return receivers.find(receiver => receiver.header.id === this.invoice.header.receiverId);
    }

    getSendableDocumentLinks(documentLinks: DocumentLink[]): DocumentLink[] {
        return this.getDocumentLinks(documentLinks)
            .filter(docLink => docLink.attachToEmail && docLink.type === DocumentLinkType.Invoice);
    }

    getSelectableContracts(contracts: Contract[]): Contract[] {
        const invoiceContract = this.getContract(contracts);
        const invoiceableContracts = ContractQuery.getInvoiceableContracts(contracts);

        if (!invoiceContract) {
            return invoiceableContracts;
        }
        return [
            invoiceContract,
            ...invoiceableContracts.filter(contract => contract.header.id !== this.invoice.header.contractId)
        ];
    }

    isSendable(documentLinks: DocumentLink[]): boolean {
        return this.invoice.header.status === InvoiceStatus.created && this.getSendableDocumentLinks(documentLinks).length > 0;
    }

    static getBilledInvoices(invoices: Invoice[]): Invoice[] {
        return invoices.filter(invoice => invoice.isBilled());
    }

    static getDueInvoices(invoices: Invoice[]): Invoice[] {
        return invoices.filter(invoice => invoice.isDue());
    }

    static getOpenInvoices(invoices: Invoice[]): Invoice[] {
        return invoices.filter(invoice => invoice.isOpen());
    }

    static getPaidInvoices(invoices: Invoice[]): Invoice[] {
        return invoices.filter(invoice => invoice.isPaid());
    }

}
