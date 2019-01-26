import {InvoiceItemData} from './invoice-data.model';
import {InvoiceItem} from './invoice-item';

export class InvoiceItemFactory {

    static fromData(data: InvoiceItemData): InvoiceItem {
        return new InvoiceItem(data);
    }
}
