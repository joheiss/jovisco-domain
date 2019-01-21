import {
    BillingMethod,
    Contract,
    ContractData, ContractsEntity, ContractSummaries, ContractSummariesData,
    Invoice,
    InvoiceData, InvoicesEntity, InvoiceStatus, InvoiceSummaries, InvoiceSummariesData, MasterdataStatus,
    PaymentMethod,
    Receiver,
    ReceiverData, ReceiversEntity, ReceiverSummaries, ReceiverSummariesData
} from '../lib/invoicing';
import {DateTime, Info} from 'luxon';
import {DateUtility} from '../lib/utils';
import {Revenue} from '../lib/reporting';
import {CountryData, SettingData, VatData} from '../lib/settings';
import {SettingsEntity} from '../lib/settings/settings-entity';

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
        startDate: startDate,
        endDate: endDate,
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

export const mockAllInvoices = (): InvoiceData[] => {

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const allInvoices: InvoiceData[] = [];

    let issuedAtYear = currentYear, issuedAtMonth = currentMonth;
    let issuedAt: Date;
    let id = 5900;
    let receiverId, contractId, billingMethod, cashDiscount;
    // invoices and credit requests
    for (let h = 0; h < 2; h++) {
        if (h === 0) {
            receiverId = '1901';
            billingMethod = BillingMethod.Invoice;
            cashDiscount = true;
        } else {
            receiverId = '1902';
            billingMethod = BillingMethod.CreditNote;
            cashDiscount = false;
        }
        // --- invoices for the past 4 years
        for (let i = 3; i >= 0; i--) {
            issuedAtYear = currentYear - i;
            if (h === 0) {
                contractId = 4900 + (i * 2) + 1;
            } else {
                contractId = 4900 + (i * 2) + 2;
            }
            for (let j = 0; j < 12; j++) {
                issuedAtMonth = j;
                issuedAt = new Date(issuedAtYear, issuedAtMonth, 15);
                const billingPeriod = `${today.getFullYear().toString()} - ${(today.getMonth() + 1).toString()}`;
                if (issuedAt < today) {
                    id++;
                    const invoice = getBaseInvoice(id, issuedAt, receiverId, contractId.toString(), billingPeriod, cashDiscount, billingMethod);
                    allInvoices.push(invoice);
                }
            }
        }
    }
    return allInvoices.sort((a: any, b: any) => {
        const result = b.issuedAt.getTime() - a.issuedAt.getTime();
        return result ? result : a.id.localeCompare(b.id);
    });
};

const getBaseInvoice = (id: number, issuedAt: Date, receiverId: string, contractId: string,
                        billingPeriod: string, cashDiscount: boolean, billingMethod: BillingMethod): InvoiceData => {
    return {
        id: id.toString(),
        issuedAt: issuedAt,
        objectType: 'invoices',
        organization: 'THQ',
        status: InvoiceStatus.created,
        receiverId: receiverId,
        contractId: contractId,
        paymentTerms: cashDiscount ? '30 Tage: 3 % Skonto; 60 Tage: netto' : '30 Tage: netto',
        paymentMethod: PaymentMethod.BankTransfer,
        billingMethod: billingMethod,
        billingPeriod: billingPeriod,
        cashDiscountDays: cashDiscount ? 30 : 0,
        cashDiscountPercentage: cashDiscount ? 3.0 : 0.0,
        dueInDays: cashDiscount ? 60 : 30,
        currency: 'EUR',
        vatPercentage: 19.0,
        invoiceText: 'Dieser Text wird auf der Rechnung gedruckt.',
        internalText: 'Dieser Text ist für interne Zwecke.',
        items: [
            {
                id: 1, contractItemId: 1, description: 'Arbeitstage im Projekt T/E/S/T', pricePerUnit: 1.00,
                quantity: 1.0, quantityUnit: 'Tage', cashDiscountAllowed: true, vatPercentage: 19.0
            },
        ]
    };
};

export const mockInvoicesEntity = (): InvoicesEntity => {
    const allInvoices = mockAllInvoices();
    const entity = {} as InvoicesEntity;
    // @ts-ignore
    allInvoices.map(i => entity[i.id] = i).sort((a: any, b: any) => b.issuedAt - a.issuedAt);
    return entity;
};

export const mockInvoiceSummaries = (): InvoiceSummariesData => {
    const receivers = mockReceiversEntity();
    const invoices = mockInvoicesEntity();
    return InvoiceSummaries.create(receivers, invoices);
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

export const mockAllReceivers = (): ReceiverData[] => {
    return [
        getBaseReceiver('1901', 'Test AG', 'officium@test-ag.de'),
        getBaseReceiver('1902', 'Test GmbH', 'buero@test-gmbh.de')
    ];
};

const getBaseReceiver = (id: string, name: string, email: string): ReceiverData => {
    return {
        id: id,
        objectType: 'receivers',
        organization: 'THQ',
        name: name,
        status: MasterdataStatus.active,
        address: {
            country: 'DE',
            postalCode: '77777',
            city: 'Testlingen',
            street: 'Testgasse 1',
            email: email,
            phone: '+49 777 12345678',
            fax: '+49 777 12345678'
        }
    };
};

export const mockReceiversEntity = (): ReceiversEntity => {
    const allReceivers = mockAllReceivers();
    const entity = {} as ReceiversEntity;
    // @ts-ignore
    allReceivers.map(r => entity[r.id] = r);
    return entity;
};

export const mockReceiverSummaries = (): ReceiverSummariesData => {
    const contracts = mockContractsEntity();
    const receivers = mockReceiversEntity();
    const invoices = mockInvoicesEntity();
    return ReceiverSummaries.create(receivers, contracts, invoices);
};

export const mockAllSettings = (): SettingData[] => {
    return [mockAllCountries(), mockAllVatSettings()];
};

export const mockSingleCountry = (): CountryData => {
    return {isoCode: 'DE', names: {de: 'Deutschland', en: 'Germany', fr: 'Allemagne', it: 'Germania'}} as CountryData;
};

export const mockAllCountries = (): any => {
    return {
        id: 'countries',
        values: [
            {isoCode: 'AT', names: {de: 'Österreich', en: 'Austria'}},
            {isoCode: 'CH', names: {de: 'Schweiz', en: 'Switzerland', fr: 'Suisse'}},
            {isoCode: 'DE', names: {de: 'Deutschland', en: 'Germany', fr: 'Allemagne', it: 'Germania'}}
        ]
    };
};

export const mockSingleVatSetting = (): VatData => {
    const validFrom = DateTime.local(2015, 1, 1).startOf('day').toJSDate();
    const validTo = DateTime.local(9999, 12, 31).endOf('day').toJSDate();
    return {percentage: 19, taxCode: 'DE_full', validFrom: validFrom, validTo: validTo};
};

export const mockAllVatSettings = (): any => {
    const validFrom = DateTime.local(2015, 1, 1).startOf('day').toJSDate();
    const validTo = DateTime.local(9999, 12, 31).endOf('day').toJSDate();

    return {
        id: 'vat',
        values: [
            {percentage: 20, taxCode: 'AT_full', validFrom: validFrom, validTo: validTo},
            {percentage: 0, taxCode: 'AT_none', validFrom: validFrom, validTo: validTo},
            {percentage: 10, taxCode: 'AT_reduced', validFrom: validFrom, validTo: validTo},
            {percentage: 19, taxCode: 'DE_full', validFrom: validFrom, validTo: validTo},
            {percentage: 0, taxCode: 'DE_none', validFrom: validFrom, validTo: validTo},
            {percentage: 7, taxCode: 'DE_reduced', validFrom: validFrom, validTo: validTo},
            {percentage: 13, taxCode: 'AT_special', validFrom: validFrom, validTo: validTo}
        ].sort((a, b) => a.taxCode.localeCompare(b.taxCode))
    };
};

export const mockSettingsEntity = (): SettingsEntity => {
    const allSettings = mockAllSettings();
    const entity = {} as SettingsEntity;
    // @ts-ignore
    allSettings.map(s => entity[s.id] = s);
    return entity;
};


