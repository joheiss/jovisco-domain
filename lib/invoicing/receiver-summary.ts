import {Summary} from './summary';
import {Receiver} from './receiver';

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

export type ReceiverSummaries = {[id: string]: ReceiverSummary };

