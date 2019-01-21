import {ReceiversEntity} from './receivers-entity';
import {ContractsEntity} from './contracts-entity';
import {InvoicesEntity} from './invoices-entity';
import {ContractSummaryData} from './contract-summary-data.model';
import {Contract} from './contract';
import {ContractSummary} from './contract-summary';

export type ContractSummariesData = { [id: string]: ContractSummaryData };

export class ContractSummaries {

    public static create(receivers: ReceiversEntity, contracts: ContractsEntity, invoices: InvoicesEntity): ContractSummariesData {

        const summaries = {} as ContractSummariesData;

        Object.keys(contracts)
            .forEach(contractId => {
                summaries[contractId] = ContractSummary.create(Contract.createFromData(contracts[contractId]))
                    .setReceiverInfos(receivers)
                    .setInvoiceInfos(invoices)
                    .data;
            });

        return summaries;
    }
}
