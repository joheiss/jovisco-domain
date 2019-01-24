import {TransactionHeaderData, TransactionItemData} from './transaction-data.model';
import {PaymentMethod} from './payment-method.model';
import {BillingMethod} from './billing-method.model';
import {ContractTerm} from './contract-term';

export interface ContractData extends ContractHeaderData {
    items: ContractItemData[];
}

export interface ContractHeaderData extends TransactionHeaderData {
    description?: string;
    customerId: string;
    term: ContractTerm,
    paymentTerms?: string;
    paymentMethod?: PaymentMethod;
    billingMethod?: BillingMethod;
    cashDiscountDays?: number;
    cashDiscountPercentage?: number;
    dueDays?: number;
    currency?: string;
    budget?: number;
    invoiceText?: string;
    internalText?: string;
}

export interface ContractItemData extends TransactionItemData {
    description?: string;
    pricePerUnit?: number;
    priceUnit?: string;
    cashDiscountAllowed?: boolean;
}

