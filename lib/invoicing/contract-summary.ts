import {Summary} from './summary';
import {Contract} from './contract';
import {ContractsEntity} from './contracts-entity';
import {ReceiversEntity} from './receivers-entity';
import {InvoicesEntity} from './invoices-entity';
import {Invoice} from './invoice';

export interface ContractSummary extends Summary {
    object: Contract;
    receiverName: string;
    changeable: boolean;
    revenue: number;
    lastInvoiceId: string;
}

export type ContractSummariesType = {[id: string]: ContractSummary };

export class ContractSummaries {

    public static create(contracts: ContractsEntity, receivers: ReceiversEntity, invoices: InvoicesEntity): ContractSummariesType {

        const summaries = {} as ContractSummariesType;

        Object.keys(contracts)
            .forEach(contractId => {
                const receiver = receivers[contracts[contractId].customerId];
                summaries[contractId] = {
                    object: Contract.createFromData(contracts[contractId]),
                    receiverName: receiver ? receivers[contracts[contractId].customerId].name : 'Unbekannt',
                    revenue: 0,
                    changeable: false,
                    lastInvoiceId: ''
                };
                Object.keys(invoices)
                    .filter(invoiceId => invoices[invoiceId].contractId === contractId)
                    .forEach(invoiceId => {
                        const invoice = Invoice.createFromData(invoices[invoiceId]);
                        // calculate revenue
                        summaries[contractId].revenue = summaries[contractId].revenue + invoice.netValue;
                        // get last invoice Id
                        if (invoiceId > summaries[contractId].lastInvoiceId) {
                            summaries[contractId].lastInvoiceId = invoiceId;
                        }
                    });
                // get changeability
                summaries[contractId].changeable = summaries[contractId].lastInvoiceId.length === 0;
            });

        return summaries;
    }

}
