import {InvoiceItemData} from './invoice-data.model';
import {InvoiceItem} from './invoice-item';

export class InvoiceItemFactory {

    static fromData(data: InvoiceItemData): InvoiceItem {
        return new InvoiceItem(data);
    }

    static fromDataArray(items: InvoiceItemData[]): InvoiceItem[] {
        if (!items.length) return [];
        return items
            .filter(item => !!item)
            .map(item => InvoiceItemFactory.fromData(item));
    }
}
