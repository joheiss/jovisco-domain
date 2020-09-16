import {Receiver} from './receiver';
import {SummaryData} from './summary-data.model';

export interface ReceiverSummaryData extends SummaryData {
    object: Receiver;
    deletable: boolean;
    activeContractsCount: number;
    expiredContractsCount: number;
    lastContractId: string;
    dueInvoicesCount: number;
    openInvoicesCount: number;
    lastInvoiceId: string;
}
