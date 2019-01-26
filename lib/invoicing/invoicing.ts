import {Contract} from './contract';
import {Invoice} from './invoice';
import {InvoiceData} from './invoice-data.model';
import {DateTime} from 'luxon';
import {InvoiceStatus} from './invoice-status.model';
import {InvoiceFactory} from './invoice-factory';

export class Invoicing {

   static createInvoiceFromContract(
        contract: Contract,
        billingPeriod: string,
        quantity: number,
        vatPercentage: number = 19,
        id?: string): Invoice {

        const data: InvoiceData = {
            id: id ,
            objectType: 'invoices',
            organization: contract.header.organization,
            billingMethod: contract.header.billingMethod,
            billingPeriod: billingPeriod,
            cashDiscountDays: contract.header.cashDiscountDays,
            cashDiscountPercentage: contract.header.cashDiscountPercentage,
            contractId: contract.header.id,
            currency: contract.header.currency,
            dueInDays: contract.header.dueDays,
            internalText: contract.header.internalText,
            invoiceText: contract.header.invoiceText,
            issuedAt: DateTime.local().toJSDate(),
            paymentMethod: contract.header.paymentMethod,
            paymentTerms: contract.header.paymentTerms,
            receiverId: contract.header.customerId,
            status: InvoiceStatus.created,
            vatPercentage: vatPercentage || 19,
            items: [
                {
                    id: 1,
                    contractItemId: contract.items[0].id,
                    description: contract.items[0].description,
                    cashDiscountAllowed: contract.items[0].cashDiscountAllowed,
                    pricePerUnit: contract.items[0].pricePerUnit,
                    quantity: quantity,
                    quantityUnit: contract.items[0].priceUnit,
                    vatPercentage: vatPercentage || 19
                }
            ]
        };
        return InvoiceFactory.fromData(data);
    }
}
