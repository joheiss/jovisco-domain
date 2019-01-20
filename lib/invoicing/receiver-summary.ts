import {Summary} from './summary';
import {Receiver} from './receiver';
import {ReceiversEntity} from './receivers-entity';
import {ContractsEntity} from './contracts-entity';
import {InvoicesEntity} from './invoices-entity';
import {Contract} from './contract';
import {Invoice} from './invoice';

export interface ReceiverSummary extends Summary {
    object: Receiver;
    deletable: boolean;
    activeContractsCount: number;
    expiredContractsCount: number;
    lastContractId: string;
    dueInvoicesCount: number;
    openInvoicesCount: number;
    lastInvoiceId: string;
}

export type ReceiverSummariesType = {[id: string]: ReceiverSummary };

export class ReceiverSummaries {

    public static create(receivers: ReceiversEntity, contracts: ContractsEntity, invoices: InvoicesEntity): ReceiverSummariesType {

        const summaries = {} as ReceiverSummariesType;
        Object.keys(receivers)
            .forEach(receiverId => {
                summaries[receiverId] = {
                    object:  Receiver.createFromData(receivers[receiverId]),
                    deletable: false,
                    activeContractsCount: 0,
                    expiredContractsCount: 0,
                    lastContractId: '',
                    dueInvoicesCount: 0,
                    openInvoicesCount: 0,
                    lastInvoiceId: ''
                };
                Object.keys(contracts)
                    .filter(contractId => contracts[contractId].customerId === receiverId)
                    .forEach(contractId => {
                        const contract = Contract.createFromData(contracts[contractId]);
                        // get counts for active and expired contracts
                        if (contract.isActive() || contract.isFuture()) {
                            ++summaries[receiverId].activeContractsCount;
                        } else {
                            ++summaries[receiverId].expiredContractsCount;
                        }
                        // get last contract Id
                        if (contractId > summaries[receiverId].lastContractId) {
                            summaries[receiverId].lastContractId = contractId;
                        }
                    });
                Object.keys(invoices)
                    .filter(invoiceId => invoices[invoiceId].receiverId === receiverId)
                    .forEach(invoiceId => {
                        const invoice = Invoice.createFromData(invoices[invoiceId]);
                        // get counts for open and due invoices
                        if (invoice.isDue()) {
                            summaries[receiverId].dueInvoicesCount++;
                        }
                        if (invoice.isOpen()) {
                            summaries[receiverId].openInvoicesCount++;
                        }
                        // get last invoice Id
                        if (invoiceId > summaries[receiverId].lastInvoiceId) {
                            summaries[receiverId].lastInvoiceId = invoiceId;
                        }
                    });
                // get deletable
                summaries[receiverId].deletable = !(summaries[receiverId].lastContractId.length || summaries[receiverId].lastInvoiceId.length);
            });

        return summaries;
    }
}

