import {Contract} from './contract';
import {InvoiceData, InvoiceHeaderData, InvoiceItemData} from './invoice-data.model';
import {DateUtility} from '../utils';
import {InvoiceStatus} from './invoice-status.model';
import {Invoice} from './invoice';
import {InvoiceItem} from './invoice-item';

export class InvoiceFactory {

    static createFromContract(contract: Contract): Invoice {

        const data: InvoiceData = {
            ...Invoice.defaultValues(),
            organization: contract.header.organization,
            billingMethod: contract.header.billingMethod,
            cashDiscountDays: contract.header.cashDiscountDays,
            cashDiscountPercentage: contract.header.cashDiscountPercentage,
            contractId: contract.header.id,
            currency: contract.header.currency,
            dueInDays: contract.header.dueDays,
            invoiceText: contract.header.invoiceText,
            issuedAt: DateUtility.getCurrentDate(),
            paymentMethod: contract.header.paymentMethod,
            paymentTerms: contract.header.paymentTerms,
            receiverId: contract.header.customerId,
            status: InvoiceStatus.created,
            items: [
                {
                    id: 1,
                    contractItemId: contract.items[0].id,
                    description: contract.items[0].description,
                    cashDiscountAllowed: contract.items[0].cashDiscountAllowed,
                    pricePerUnit: contract.items[0].pricePerUnit,
                    quantityUnit: contract.items[0].priceUnit,
                }
            ]
        };
        return InvoiceFactory.createFromData(data);
    }

    static createFromData(data: InvoiceData): Invoice {
        if (!data) {
            throw new Error('invalid input');
        }
        const header = InvoiceFactory.extractHeaderFromData(data);
        console.log('header: ', header);
        const items = data.items ? InvoiceFactory.createItemsFromData(data.items) : [];
        return new Invoice(header, items);
    }

    protected static createItemsFromData(items: InvoiceItemData[]): InvoiceItem[] {
        if (items.length) {
            return items
                .filter(item => !!item)
                .map(item => InvoiceItem.createFromData(item));
        }
        return [];
    }

    protected static extractHeaderFromData(data: InvoiceData): InvoiceHeaderData {
        console.log('extract header - data: ', data);
        const {items: removed1, ...header} = data;
        console.log('extract header: ', header);
        const result = Object.assign({}, Invoice.defaultValues(), header) as InvoiceHeaderData;
        console.log('extract header - result ', result);
        return result;
    }

}
