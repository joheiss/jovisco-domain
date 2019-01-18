import {
    BillingMethod,
    Contract,
    ContractData,
    Invoice,
    InvoiceData,
    PaymentMethod,
    Receiver,
    ReceiverData
} from '../lib/invoicing';
import {DateTime, Info} from 'luxon';
import {DateUtility} from '../lib/utils';
import {Revenue} from '../lib/reporting';

export const mockContract = (): Contract => {
    const issuedAt = DateTime.local().minus({ months: 1});
    const startDate = DateUtility.getDefaultNextPeriodStartDate(issuedAt.toJSDate());
    const endDate = DateUtility.getDefaultNextPeriodEndDate(startDate);
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
        endDate: endDate,
        internalText: '',
        invoiceText: 'according to test contract 4901',
        issuedAt: issuedAt.toJSDate(),
        paymentMethod: PaymentMethod.BankTransfer,
        paymentTerms: '30 Tage: 3% Skonto; 60 Tage: netto',
        startDate: startDate,
        items: [
            {id: 1, cashDiscountAllowed: true, description: 'Arbeitszeit', pricePerUnit: 123.45, priceUnit: 'Std.'}
        ]
    };
    return Contract.createFromData(data);
};

export const mockInvoice = (): Invoice => {
    const issuedAt = DateUtility.getCurrentDate();
    const month = Revenue.calculateRevenuePeriod(issuedAt).month;
    const periodName = `${Info.months()[month - 1]}`;
    const year = `${Revenue.calculateRevenuePeriod(issuedAt).year}`;
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
        issuedAt: issuedAt,
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

export const mockReceiver = (): Receiver => {

    const data: ReceiverData = {
        id: '1901',
        organization: 'GHQ',
        name: 'Test Receiver 1901',
        address: {
            postalCode: '77777',
            city: 'Testingen',
            street: 'Test Allee 7',
            email: 'test@test.example.de',
            phone: '+49 777 7654321',
            fax: '+49 777 7654329',
            webSite: 'http://www.test.example.de'
        }
    };
    return Receiver.createFromData(data);
};

