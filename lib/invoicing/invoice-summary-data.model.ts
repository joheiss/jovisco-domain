import {Invoice} from './invoice';
import {SummaryData} from './summary-data.model';

export interface InvoiceSummaryData extends SummaryData {
    object: Invoice;
    receiverName: string;
    changeable: boolean;
}
