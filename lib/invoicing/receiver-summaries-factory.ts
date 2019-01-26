import {ReceiversEntity} from './receivers-entity';
import {ContractsEntity} from './contracts-entity';
import {InvoicesEntity} from './invoices-entity';
import {ReceiverSummaryData} from './receiver-summary-data.model';
import {ReceiverSummaryFactory} from './receiver-summary-factory';
import {ReceiverFactory} from './receiver-factory';

export type ReceiverSummariesData = { [id: string]: ReceiverSummaryData };

export class ReceiverSummariesFactory {

    static create(receivers: ReceiversEntity, contracts: ContractsEntity, invoices: InvoicesEntity): ReceiverSummariesData {

        const summaries = {} as ReceiverSummariesData;

        Object.keys(receivers).forEach(receiverId => {
            summaries[receiverId] = ReceiverSummaryFactory.create(ReceiverFactory.fromData(receivers[receiverId]))
                .setContractInfos(contracts)
                .setInvoiceInfos(invoices)
                .data;
        });
        return summaries;
    }
}

