import {Summary} from './summary';
import {Invoice} from './invoice';

export interface InvoiceSummary extends Summary {
    object: Invoice;
    receiverName: string;
    changeable: boolean;
}

export type InvoiceSummaries = {[id: string]: InvoiceSummary };
