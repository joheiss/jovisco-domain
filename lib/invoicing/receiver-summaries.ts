import {Receiver} from './receiver';
import {ReceiversEntity} from './receivers-entity';
import {ContractsEntity} from './contracts-entity';
import {InvoicesEntity} from './invoices-entity';
import {ReceiverSummaryData} from './receiver-summary-data.model';
import {ReceiverSummary} from './receiver-summary';

export type ReceiverSummariesData = { [id: string]: ReceiverSummaryData };

export class ReceiverSummaries {

    static create(receivers: ReceiversEntity, contracts: ContractsEntity, invoices: InvoicesEntity): ReceiverSummariesData {

        const summaries = {} as ReceiverSummariesData;

        Object.keys(receivers).forEach(receiverId => {
            summaries[receiverId] = ReceiverSummary.create(Receiver.createFromData(receivers[receiverId]))
                .setContractInfos(contracts)
                .setInvoiceInfos(invoices)
                .data;
        });

        return summaries;
    }
}

