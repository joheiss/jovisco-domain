import {BillingMethod, Contract, ContractData, Invoice, InvoiceData, Invoicing, PaymentMethod} from '../lib/invoicing';
import {DateTime, Info} from 'luxon';
import {inspect} from 'util';

describe('initial test', () => {
    it('should always be OK', () => {
        expect(1).toBe(1);
    });
});

describe('contract tests', () => {
    it('should create a contract', () => {
        const contract = mockContract();
        console.log('contract: ', inspect(contract));
        expect(contract).toBeTruthy();
        expect(contract.header.objectType === 'contracts');
        expect(contract.isActive()).toBeTruthy();
        expect(contract.isFuture()).toBeFalsy();
        expect(contract.isInvoiceable()).toBeTruthy();
        console.log('duration in days: ', contract.durationInDays);
        expect(contract.durationInDays).toBeGreaterThanOrEqual(89);
    });
});

describe('invoice tests', () => {
    it('should create an invoice from contract - with id, period, quantity and vat', () => {
        const contract = mockContract();
        const period = 'Januar 2019';
        const quantity = 10;
        const vatPercentage = 19.0;
        const invoice = Invoicing.createInvoiceFromContract(contract, period, quantity, vatPercentage, '5901');
        console.log('invoice: ', invoice);
        expect(invoice).toBeTruthy();
        expect(invoice.header.objectType).toBe('invoices');
        expect(invoice.vatPercentage).toBe(19.0);
        expect(invoice.netValue).toEqual(contract.items[0].pricePerUnit * quantity);
        expect(invoice.vatAmount).toEqual(invoice.netValue * vatPercentage / 100);
        expect(invoice.grossValue).toEqual(invoice.netValue + invoice.vatAmount);
        expect(invoice.cashDiscountBaseAmount).toEqual(invoice.grossValue);
        expect(invoice.cashDiscountAmount).toEqual(invoice.cashDiscountBaseAmount * invoice.cashDiscountPercentage / 100);
        expect(invoice.paymentAmount).toEqual(invoice.grossValue - invoice.cashDiscountAmount);
        const issuedAt = invoice.header.issuedAt ? DateTime.fromJSDate(invoice.header.issuedAt) : DateTime.utc().startOf('day');
        const dtCashDiscountDate = DateTime.fromJSDate(invoice.cashDiscountDate);
        const isCashDiscountDateOk = dtCashDiscountDate.equals(issuedAt.plus({days: invoice.header.cashDiscountDays}));
        expect(isCashDiscountDateOk).toBeTruthy();
        const dtDueDate = DateTime.fromJSDate(invoice.dueDate);
        const isDueDateOk = dtDueDate.equals(issuedAt.plus({days: invoice.header.dueInDays}));
        expect(isDueDateOk).toBeTruthy();
        expect(invoice.isBilled()).toBeFalsy();
        expect(invoice.isDue()).toBeFalsy();
        expect(invoice.isOpen()).toBeTruthy();
        expect(invoice.isPaid()).toBeFalsy();
        expect(invoice.items.length).toBe(1);
        expect(invoice.items[0].id).toBe(1);
        expect(invoice.items[0].contractItemId).toBe(contract.items[0].id);
        expect(invoice.items[0].description).toEqual(contract.items[0].description);
        expect(invoice.items[0].quantity).toBe(quantity);
        expect(invoice.items[0].quantityUnit).toEqual(contract.items[0].priceUnit);
        expect(invoice.items[0].pricePerUnit).toEqual(contract.items[0].pricePerUnit);
        expect(invoice.items[0].cashDiscountAllowed).toEqual(contract.items[0].cashDiscountAllowed);
        expect(invoice.items[0].vatPercentage).toEqual(vatPercentage);
        expect(invoice.items[0].discountableValue).toEqual(invoice.items[0].grossValue);
        expect(invoice.items[0].grossValue).toEqual(invoice.items[0].netValue + invoice.items[0].vatValue);
        expect(invoice.items[0].netValue).toEqual(invoice.items[0].quantity * invoice.items[0].pricePerUnit);
        expect(invoice.items[0].vatValue).toEqual(invoice.items[0].netValue * vatPercentage / 100);
    });
    it('should create an invoice from contract - without id, period, quantity and vat', () => {
        const contract = mockContract();
        const invoice = Invoice.createFromContract(contract);
        console.log('invoice: ', invoice);
        invoice.header.id = '5901';
        invoice.header.vatPercentage = 19.0;
        invoice.header.billingPeriod = 'Januar 2019';
        invoice.items[0].quantity = 10;
        invoice.items[0].vatPercentage = invoice.header.vatPercentage;
        expect(invoice).toBeTruthy();
        expect(invoice.header.objectType).toBe('invoices');
        expect(invoice.vatPercentage).toBe(19.0);
        expect(invoice.netValue).toEqual(contract.items[0].pricePerUnit * 10);
        expect(invoice.vatAmount).toEqual(invoice.netValue * 19.0 / 100);
        expect(invoice.grossValue).toEqual(invoice.netValue + invoice.vatAmount);
        expect(invoice.cashDiscountBaseAmount).toEqual(invoice.grossValue);
        expect(invoice.cashDiscountAmount).toEqual(invoice.cashDiscountBaseAmount * invoice.cashDiscountPercentage / 100);
        expect(invoice.paymentAmount).toEqual(invoice.grossValue - invoice.cashDiscountAmount);
        const issuedAt = invoice.header.issuedAt ? DateTime.fromJSDate(invoice.header.issuedAt) : DateTime.utc().startOf('day');
        const dtCashDiscountDate = DateTime.fromJSDate(invoice.cashDiscountDate);
        const isCashDiscountDateOk = dtCashDiscountDate.equals(issuedAt.plus({days: invoice.header.cashDiscountDays}));
        expect(isCashDiscountDateOk).toBeTruthy();
        const dtDueDate = DateTime.fromJSDate(invoice.dueDate);
        const isDueDateOk = dtDueDate.equals(issuedAt.plus({days: invoice.header.dueInDays}));
        expect(isDueDateOk).toBeTruthy();
        expect(invoice.isBilled()).toBeFalsy();
        expect(invoice.isDue()).toBeFalsy();
        expect(invoice.isOpen()).toBeTruthy();
        expect(invoice.isPaid()).toBeFalsy();
        expect(invoice.items.length).toBe(1);
        expect(invoice.items[0].id).toBe(1);
        expect(invoice.items[0].contractItemId).toBe(contract.items[0].id);
        expect(invoice.items[0].description).toEqual(contract.items[0].description);
        expect(invoice.items[0].quantity).toBe(10);
        expect(invoice.items[0].quantityUnit).toEqual(contract.items[0].priceUnit);
        expect(invoice.items[0].pricePerUnit).toEqual(contract.items[0].pricePerUnit);
        expect(invoice.items[0].cashDiscountAllowed).toEqual(contract.items[0].cashDiscountAllowed);
        expect(invoice.items[0].vatPercentage).toEqual(19.0);
        expect(invoice.items[0].discountableValue).toEqual(invoice.items[0].grossValue);
        expect(invoice.items[0].grossValue).toEqual(invoice.items[0].netValue + invoice.items[0].vatValue);
        expect(invoice.items[0].netValue).toEqual(invoice.items[0].quantity * invoice.items[0].pricePerUnit);
        expect(invoice.items[0].vatValue).toEqual(invoice.items[0].netValue * 19.0 / 100);
    });
    it('should create an invoice from data', () => {
        const invoice = mockInvoice();
        console.log('invoice: ', invoice);
        expect(invoice).toBeTruthy();
        expect(invoice.header.objectType).toBe('invoices');
        expect(invoice.vatPercentage).toBe(19.0);
        expect(invoice.netValue).toEqual(invoice.items[0].pricePerUnit * invoice.items[0].quantity);
        expect(invoice.vatAmount).toEqual(invoice.netValue * invoice.vatPercentage / 100);
        expect(invoice.grossValue).toEqual(invoice.netValue + invoice.vatAmount);
        expect(invoice.cashDiscountBaseAmount).toEqual(invoice.grossValue);
        expect(invoice.cashDiscountAmount).toEqual(invoice.cashDiscountBaseAmount * invoice.cashDiscountPercentage / 100);
        expect(invoice.paymentAmount).toEqual(invoice.grossValue - invoice.cashDiscountAmount);
        const issuedAt = invoice.header.issuedAt ? DateTime.fromJSDate(invoice.header.issuedAt) : DateTime.utc().startOf('day');
        const dtCashDiscountDate = DateTime.fromJSDate(invoice.cashDiscountDate);
        const isCashDiscountDateOk = dtCashDiscountDate.equals(issuedAt.plus({days: invoice.header.cashDiscountDays}));
        expect(isCashDiscountDateOk).toBeTruthy();
        const dtDueDate = DateTime.fromJSDate(invoice.dueDate);
        const isDueDateOk = dtDueDate.equals(issuedAt.plus({days: invoice.header.dueInDays}));
        expect(isDueDateOk).toBeTruthy();
        expect(invoice.isBilled()).toBeFalsy();
        expect(invoice.isDue()).toBeFalsy();
        expect(invoice.isOpen()).toBeTruthy();
        expect(invoice.isPaid()).toBeFalsy();
        expect(invoice.items.length).toBe(1);
        expect(invoice.items[0].id).toBe(1);
        expect(invoice.items[0].contractItemId).toBe(1);
        expect(invoice.items[0].description).toEqual('Arbeitszeit');
        expect(invoice.items[0].quantity).toBe(10);
        expect(invoice.items[0].quantityUnit).toEqual('Std.');
        expect(invoice.items[0].pricePerUnit).toEqual(123.45);
        expect(invoice.items[0].cashDiscountAllowed).toBeTruthy();
        expect(invoice.items[0].vatPercentage).toEqual(19.0);
        expect(invoice.items[0].discountableValue).toEqual(invoice.items[0].grossValue);
        expect(invoice.items[0].grossValue).toEqual(invoice.items[0].netValue + invoice.items[0].vatValue);
        expect(invoice.items[0].netValue).toEqual(invoice.items[0].quantity * invoice.items[0].pricePerUnit);
        expect(invoice.items[0].vatValue).toEqual(invoice.items[0].netValue * 19.0 / 100);
    });
});

const mockContract = (): Contract => {
    const issuedAt = DateTime.utc().minus({ months: 1});
    const startDate = issuedAt.plus({ months: 1}).startOf('month');
    const endDate = startDate.plus({ months: 2}).endOf('month');
    const data: ContractData = {
        id: '4901',
        organization: 'GHQ',
        billingMethod: BillingMethod.Invoice,
        budget: 1234.56,
        cashDiscountDays: 30,
        cashDiscountPercentage: 3,
        currency: 'EUR',
        customerId: '1901',
        description: 'Test Contract 4901',
        dueDays: 60,
        endDate: endDate.toJSDate(),
        internalText: '',
        invoiceText: 'according to test contract 4901',
        issuedAt: issuedAt.toJSDate(),
        paymentMethod: PaymentMethod.BankTransfer,
        paymentTerms: '30 Tage: 3% Skonto; 60 Tage: netto',
        startDate: startDate.toJSDate(),
        items: [
            {id: 1, cashDiscountAllowed: true, description: 'Arbeitszeit', pricePerUnit: 123.45, priceUnit: 'Std.'}
        ]
    };
    return Contract.createFromData(data);
};

const mockInvoice = (): Invoice => {
    const issuedAt = DateTime.utc();
    const month = issuedAt.minus({months: 1}).month;
    const periodName = `${Info.months()[month - 1]}`;
    const year = `${issuedAt.minus({months: 1}).year}`;
    const billingPeriod = `${periodName} ${year}`;

    const data: InvoiceData = {
        id: '5901',
        organization: 'GHQ',
        billingPeriod: billingPeriod,
        cashDiscountDays: 30,
        cashDiscountPercentage: 3,
        contractId: '4901',
        currency: 'EUR',
        dueInDays: 60,
        internalText: 'Das ist eine Testrechnung.',
        invoiceText: 'nach Aufwand',
        issuedAt: issuedAt.toJSDate(),
        paymentTerms: '30 Tage: 3% Skonto; 60 Tage: netto',
        receiverId: '1901',
        vatPercentage: 19.0,
        items: [
            {
                id: 1,
                contractItemId: 1,
                cashDiscountAllowed: true,
                description: 'Arbeitszeit',
                quantity: 10,
                pricePerUnit: 123.45,
                quantityUnit: 'Std.',
                vatPercentage: 19.0
            }
        ]
    };
    return Invoice.createFromData(data);
};
