import {ReceiversEntity} from './receivers-entity';
import {ContractsEntity} from './contracts-entity';
import {InvoicesEntity} from './invoices-entity';
import {ContractSummaryData} from './contract-summary-data.model';
import {ContractSummaryFactory} from './contract-summary-factory';
import {ContractFactory} from './contract-factory';

export type ContractSummariesData = { [id: string]: ContractSummaryData };

export class ContractSummariesFactory {

    static create(receivers: ReceiversEntity, contracts: ContractsEntity, invoices: InvoicesEntity): ContractSummariesData {

        const summaries = {} as ContractSummariesData;

        Object.keys(contracts).forEach(contractId => {
            summaries[contractId] = ContractSummaryFactory
                .fromContract(ContractFactory.fromData(contracts[contractId]))
                .setReceiverInfos(receivers)
                .setInvoiceInfos(invoices)
                .data;
        });
        return summaries;
    }
}
