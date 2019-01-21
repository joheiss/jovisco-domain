import {InvoiceData} from './invoice-data.model';
import {Invoice} from './invoice';
import {Dictionary} from './dictionary';

export type InvoicesEntity = Dictionary<InvoiceData>;
// export type InvoicesEntity = { [id: string]: InvoiceData };

export function mapInvoicesEntityToObjArray(entity: InvoicesEntity): Invoice[] {
    return Object.keys(entity).map(id => Invoice.createFromData(entity[id]));
}
