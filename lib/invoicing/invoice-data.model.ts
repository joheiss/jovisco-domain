import {TransactionHeaderData, TransactionItemData} from './transaction-data.model';
import {BillingMethod} from './billing-method.model';
import {PaymentMethod} from './payment-method.model';
import {InvoiceStatus} from './invoice-status.model';

export interface InvoiceData extends InvoiceHeaderData {
    items: InvoiceItemData[];
}

export interface InvoiceHeaderData extends TransactionHeaderData {
    status?: InvoiceStatus;
    receiverId: string;
    contractId?: string;
    billingMethod?: BillingMethod;
    billingPeriod?: string;
    currency?: string;
    cashDiscountDays?: number;
    cashDiscountPercentage?: number;
    dueInDays?: number;
    paymentTerms?: string;
    paymentMethod?: PaymentMethod;
    vatPercentage?: number;
    invoiceText?: string;
    internalText?: string;
}

export interface InvoiceItemData extends TransactionItemData {
    contractItemId?: number;
    description?: string;
    quantity?: number;
    quantityUnit?: string;
    pricePerUnit?: number;
    cashDiscountAllowed?: boolean;
    vatPercentage?: number;
}

