import {InvoiceData} from './invoice-data.model';
import {Invoice} from './invoice';

export type InvoicesEntity = { [id: number]: InvoiceData };

export function mapInvoicesEntityToObjArray(entity: InvoicesEntity): Invoice[] {
    return Object.keys(entity).map(id => Invoice.createFromData(entity[+id]));
}
