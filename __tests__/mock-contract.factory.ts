import {
    BillingMethod,
    Contract,
    ContractData,
    ContractsEntity, ContractSummaries,
    ContractSummariesData,
    PaymentMethod
} from '../lib/invoicing';
import {DateTime} from 'luxon';
import {DateUtility} from '../lib/utils';
import {mockReceiversEntity} from './mock-receiver.factory';
import {mockInvoicesEntity} from './mock-invoice.factory';
import {ContractTerm} from '../lib/invoicing/contract-term';

export const mockContract = (): Contract => {
    const issuedAt = DateTime.local().minus({ months: 1});
    const data: ContractData = {
        id: '4901',
        organization: 'GHQ',
        billingMethod: BillingMethod.Invoice,
        term: ContractTerm.getNextDefaultTerm(issuedAt.toJSDate()),
        budget: 1234.56,
        cashDiscountDays: 30,
        cashDiscountPercentage: 3,
        currency: 'EUR',
        customerId: '1901',
        description: 'Test Contract 4901',
        dueDays: 60,
        internalText: '',
        invoiceText: 'according to test contract 4901',
        issuedAt: issuedAt.toJSDate(),
        paymentMethod: PaymentMethod.BankTransfer,
        paymentTerms: '30 Tage: 3% Skonto; 60 Tage: netto',
        items: [
            {id: 1, cashDiscountAllowed: true, description: 'Arbeitszeit', pricePerUnit: 123.45, priceUnit: 'Std.'}
        ]
    };
    return Contract.createFromData(data);
};

export const mockAllContracts = (): ContractData[] => {

    const today = new Date();
    const currentYear = today.getFullYear();
    const allContracts: ContractData[] = [];

    let id = 4900;
    let description;
    let customerId;
    let billingMethod;
    let cashDiscount;

    // --- contracts for the past 4 years
    for (let i = 4; i >= 0; i--) {
        const issuedAt = DateTime.local(currentYear - i, 1, 1).startOf('day').toJSDate();
        const startDate = DateTime.local(currentYear - i, 1, 1).startOf('day').toJSDate();
        const endDate = DateTime.local(currentYear - i, 12, 31).endOf('day').toJSDate();
        for (let j = 0; j < 2; j++) {
            id++;
            if (j === 0) {
                description = `Testvertrag ${(currentYear - i).toString()} - Rechnung`;
                customerId = '1901';
                billingMethod = BillingMethod.Invoice;
                cashDiscount = true;
            } else {
                description = `Testvertrag ${(currentYear - i).toString()} - Gutschrift`;
                customerId = '1902';
                billingMethod = BillingMethod.CreditNote;
                cashDiscount = false;
            }
            const base = getBaseContract(id, issuedAt, description, customerId, startDate, endDate, cashDiscount, billingMethod);
            const contract = {...base} as ContractData;
            if (j === 1) {
                contract.items = contract.items.filter(p => p.id === 1);
            }
            allContracts.push(contract);
        }
    }
    // @ts-ignore
    return allContracts.sort((a, b) => b.id.localeCompare(a.id));
};

const getBaseContract = (id: number, issuedAt: Date, description: string, customerId: string,
                         startDate: Date, endDate: Date, cashDiscount: boolean, billingMethod: BillingMethod): ContractData => {
    return {
        id: id.toString(),
        issuedAt: issuedAt,
        objectType: 'contracts',
        organization: 'THQ',
        description: description,
        customerId: customerId,
        term: ContractTerm.create(startDate, endDate),
        paymentTerms: cashDiscount ? '30 Tage: 3 % Skonto; 60 Tage: netto' : '30 Tage: netto',
        paymentMethod: PaymentMethod.BankTransfer,
        billingMethod: billingMethod,
        cashDiscountDays: cashDiscount ? 30 : 0,
        cashDiscountPercentage: cashDiscount ? 3.0 : 0.0,
        dueDays: cashDiscount ? 60 : 30,
        currency: 'EUR',
        budget: 12.00,
        invoiceText: 'Dieser Text wird auf der Rechnung gedruckt.',
        internalText: 'Dieser Text ist für interne Zwecke.',
        isDeletable: true,
        items: [
            {id: 1, description: 'Arbeitstage im Projekt T/E/S/T', pricePerUnit: 10.00, priceUnit: 'Tage', cashDiscountAllowed: true},
            {id: 2, description: 'Reisezeit im Projekt T/E/S/T', pricePerUnit: 5.00, priceUnit: 'Std.', cashDiscountAllowed: true},
            {id: 3, description: 'km-Pauschale', pricePerUnit: 1.00, priceUnit: 'km', cashDiscountAllowed: false},
            {id: 4, description: 'Übernachtungspauschale', pricePerUnit: 3.00, priceUnit: 'Übernachtungen', cashDiscountAllowed: false}
        ]
    };
};

export const mockContractsEntity = (): ContractsEntity => {
    const allContracts = mockAllContracts();
    const entity = {} as ContractsEntity;
    // @ts-ignore
    allContracts.map(c => entity[c.id] = c);
    return entity;
};

export const mockContractSummaries = (): ContractSummariesData => {
    const contracts = mockContractsEntity();
    const receivers = mockReceiversEntity();
    const invoices = mockInvoicesEntity();
    return ContractSummaries.create(receivers, contracts, invoices);
};
