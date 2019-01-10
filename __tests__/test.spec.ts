import {BillingMethod, Contract, ContractData, Invoicing, PaymentMethod} from '../lib/invoicing';
import {DateTime} from 'luxon';
import {inspect} from 'util';
import * as util from 'util';

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
    });
});

describe('invoice tests', () => {
    it('should create an invoice from contract', () => {
        const contract = mockContract();
        const invoice = Invoicing.createInvoiceFromContract(contract, 'Januar 2019', 10, 19.0, '5901');
        console.log('invoice: ', invoice);
        expect(invoice).toBeTruthy();
        console.log('invoice net value: ', invoice.netValue);
        console.log('invoice vat amount: ', invoice.vatAmount);
        console.log('invoice gross value: ', invoice.grossValue);
        console.log('invoice cash discount base amount: ', invoice.cashDiscountBaseAmount);
        console.log('invoice cash discount amount: ', invoice.cashDiscountAmount);
        console.log('invoice payment amount: ', invoice.paymentAmount);
        console.log('invoice cash discount date: ', DateTime.fromJSDate(invoice.cashDiscountDate).toLocaleString());
        console.log('invoice due date: ', DateTime.fromJSDate(invoice.dueDate).toLocaleString());
    });
});

const mockContract = (): Contract => {
    const data: ContractData = {
        id: '4901',
        objectType: 'contracts',
        organization: 'GHQ',
        billingMethod: BillingMethod.Invoice,
        budget: 1234.56,
        cashDiscountDays: 30,
        cashDiscountPercentage: 3,
        currency: 'EUR',
        customerId: '1901',
        description: 'Test Contract 4901',
        dueDays: 60,
        endDate: DateTime.local(2019, 1, 31).toJSDate(),
        internalText: '',
        invoiceText: 'according to test contract 4901',
        isDeletable: false,
        issuedAt: DateTime.local(2018, 12, 24).toJSDate(),
        paymentMethod: PaymentMethod.BankTransfer,
        paymentTerms: '30 Tage: 3% Skonto; 60 Tage: netto',
        startDate: DateTime.local(2019, 1, 1).toJSDate(),
        items: [
            {id: 1, cashDiscountAllowed: true, description: 'Arbeitszeit', pricePerUnit: 123.45, priceUnit: 'Std.'}
        ]
    };
    return Contract.createFromData(data);
};

