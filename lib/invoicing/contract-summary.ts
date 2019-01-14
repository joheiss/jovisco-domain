import {Summary} from './summary';
import {Contract} from './contract';

export interface ContractSummary extends Summary {
    object: Contract;
    receiverName: string;
    changeable: boolean;
    revenue: number;
    lastInvoiceId: string;
}

export type ContractSummaries = {[id: string]: ContractSummary };

