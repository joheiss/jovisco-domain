import {SummaryData} from './summary-data.model';
import {Contract} from './contract';

export interface ContractSummaryData extends SummaryData {
    object: Contract;
    receiverName: string;
    changeable: boolean;
    revenue: number;
    lastInvoiceId: string;
}

