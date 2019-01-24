import {ContractItem, Invoice, InvoiceData, InvoiceItem, InvoiceStatus} from '../lib/invoicing';
import {mockContract} from './mock-contract.factory';
import {DateTime} from 'luxon';
import {mockInvoice} from './mock-invoice.factory';

describe('invoice tests', () => {

    it('should create an invoice from default values', () => {
        const invoice = Invoice.createFromData(Invoice.defaultValues());
        expect(invoice).toBeTruthy();
    });

    it('should create an invoice containing default values, if an empty object has been provided', () => {
        const data = {} as InvoiceData;
        const invoice = Invoice.createFromData(data);
        expect(invoice).toBeTruthy();
        expect(invoice.data).toEqual(Invoice.defaultValues());
    });

    it('should create an invoice from a contract', () => {
        const contract = mockContract();
        const invoice = Invoice.createFromContract(contract);
        expect(invoice).toBeTruthy();
        expect(invoice.items).toHaveLength(1);
        expect(invoice.items[0].headerRef).toBeTruthy();
        expect(invoice.header.receiverId).toEqual(contract.header.customerId);
        expect(invoice.header.contractId).toEqual(contract.header.id);
        expect(invoice.header.cashDiscountPercentage).toEqual(contract.header.cashDiscountPercentage);
        expect(invoice.header.cashDiscountDays).toEqual(contract.header.cashDiscountDays);
        expect(invoice.header.paymentMethod).toEqual(contract.header.paymentMethod);
        expect(invoice.header.billingMethod).toEqual(contract.header.billingMethod);
        expect(invoice.header.dueInDays).toEqual(contract.header.dueDays);
        expect(invoice.header.currency).toEqual(contract.header.currency);
        expect(invoice.header.invoiceText).toEqual(contract.header.invoiceText);
        expect(invoice.header.organization).toEqual(contract.header.organization);
        expect(invoice.items[0].contractItemId).toEqual(contract.items[0].id);
        expect(invoice.items[0].pricePerUnit).toEqual(contract.items[0].pricePerUnit);
        expect(invoice.items[0].quantityUnit).toEqual(contract.items[0].priceUnit);
        expect(invoice.items[0].description).toEqual(contract.items[0].description);
    });

    it('should create an invoice from mock data', () => {
        const invoice = Invoice.createFromData(mockInvoice().data);
        expect(invoice).toBeTruthy();
        expect(invoice.data).toEqual(mockInvoice().data);
    });

    describe('test getters and setters', () => {

        let invoice: Invoice;

        beforeEach(() => {
            const data = mockInvoice().data;
            invoice = Invoice.createFromData(data);
        });

        it('should return the correct cash discount amount', () => {
            const expected = 1190.00 * 3 / 100;
            expect(invoice.cashDiscountAmount).toBe(expected);
        });

        it('should return the correct cash discount base amount', () => {
            const expected = 1190.00;
            expect(invoice.cashDiscountBaseAmount).toBe(expected);
        });

        it('should return the correct cash discount date', () => {
            const expected = DateTime.local().startOf('day').plus({days: 30}).toJSDate();
            expect(invoice.cashDiscountDate).toEqual(expected);
        });

        it('should return the correct cash discount percentage', () => {
            const expected = 3.0;
            expect(invoice.cashDiscountPercentage).toEqual(expected);
        });

        it('should return the correct discounted net value', () => {
            const expected = (1190.00 - invoice.cashDiscountAmount) * 100 / 119;
            expect(invoice.discountedNetValue).toEqual(expected);
        });

        it('should return the correct due date', () => {
            const expected = DateTime.fromJSDate(invoice.header.issuedAt).plus({days: 60}).toJSDate();
            expect(invoice.dueDate).toEqual(expected);
        });

        it('should return the correct gross value', () => {
            const expected = 1190.00;
            expect(invoice.grossValue).toBe(expected);
        });

        it('should return the correct net value', () => {
            const expected = 1000.00;
            expect(invoice.netValue).toBe(expected);
        });

        it('should return the correct payment amount', () => {
            const expected = invoice.grossValue - invoice.cashDiscountAmount;
            expect(invoice.paymentAmount).toBe(expected);
        });

        it('should return the correct revenue period', () => {
            const today = DateTime.local();
            const expected = today.day > 15 ?
                {year: today.year, month: today.month} :
                {year: today.minus({months: 1}).year, month: today.minus({months: 1}).month};
            expect(invoice.revenuePeriod).toEqual(expected);
        });

        it('should return the correct vat amount', () => {
            const expected = 190.00;
            expect(invoice.vatAmount).toBe(expected);
        });

        it('should return the correct vat percentage', () => {
            const expected = 19.00;
            expect(invoice.vatPercentage).toBe(expected);
        });

        it('should return a new item with id = 2', () => {
            const expected = {...InvoiceItem.defaultValues(), id: 2, headerRef: invoice, vatPercentage: 19.0};
            expect(invoice.buildNewItemFromTemplate().data).toEqual(expected);
        });

        it('should return the correct item', () => {
            const expected = invoice.items[0];
            expect(invoice.getItem(1)).toBe(expected);
        });

        it('should return the correct invoice status', () => {
            expect(invoice.isOpen()).toBeTruthy();
            expect(invoice.isBilled()).toBeFalsy();
            expect(invoice.isDue()).toBeFalsy();
            expect(invoice.isPaid()).toBeFalsy();
            invoice.header.status = InvoiceStatus.billed;
            expect(invoice.isOpen()).toBeTruthy();
            expect(invoice.isBilled()).toBeTruthy();
            expect(invoice.isDue()).toBeFalsy();
            expect(invoice.isPaid()).toBeFalsy();
            invoice.header.issuedAt = DateTime.local().minus({months: 3}).toJSDate();
            expect(invoice.isDue).toBeTruthy();
            invoice.header.status = InvoiceStatus.paid;
            expect(invoice.isOpen()).toBeFalsy();
            expect(invoice.isBilled()).toBeFalsy();
            expect(invoice.isDue()).toBeFalsy();
            expect(invoice.isPaid()).toBeTruthy();
        });
    });

    describe('invoice item tests', () => {

        let invoice: Invoice;

        beforeEach(() => {
            invoice = mockInvoice();
        });

        it('should create an item from data', () => {
            const data = {
                id: 1,
                headerRef: invoice,
                contractItemId: 1,
                description: 'Test',
                quantity: 1,
                quantityUnit: 'Tage',
                pricePerUnit: 100.00,
                vatPercentage: 19.0,
                cashDiscountAllowed: true
            };
            const item = InvoiceItem.createFromData(data);
            expect(item).toBeTruthy();
            expect(item.data).toEqual(data);
        });

        it('should create an item from empty data', () => {
            const data = {};
            const item = InvoiceItem.createFromData(data);
            expect(item).toBeTruthy();
            expect(item.data).toEqual(InvoiceItem.defaultValues());
        });

        it('should create an item from default values', () => {
            const data = InvoiceItem.defaultValues();
            const item = InvoiceItem.createFromData(data);
            expect(item).toBeTruthy();
            expect(item.data).toEqual(InvoiceItem.defaultValues());
        });

        describe('invoice item getters and setters', () => {
            let item: InvoiceItem | undefined;

            beforeEach(() => {
                item = invoice.getItem(1);
            });

            it('should return the correct item discountable value', () => {
                const expected = 1190.00;
                // @ts-ignore
                expect(item.discountableValue).toEqual(expected);
            });

            it('should return the correct item gross value', () => {
                const expected = 1190.00;
                // @ts-ignore
                expect(item.grossValue).toEqual(expected);
            });

            it('should return the correct item net value', () => {
                const expected = 1000.00;
                // @ts-ignore
                expect(item.netValue).toEqual(expected);
            });

            it('should return the correct item vat value', () => {
                const expected = 190.00;
                // @ts-ignore
                expect(item.vatValue).toEqual(expected);
            });

            it('should return the correct item cash discount value', () => {
                const expected = 35.7;
                // @ts-ignore
                expect(item.cashDiscountValue).toEqual(expected);
            });

            it('should return the correct item discounted net value', () => {
                const expected = (1190 - 35.7) * 100 / 119;
                // @ts-ignore
                expect(item.discountedNetValue).toEqual(expected);
            });

            it('should return the correct item discounted value', () => {
                const expected = 1190 - 35.7;
                // @ts-ignore
                expect(item.discountedValue).toEqual(expected);
            });

            it('should correctly set the contract related item data', () => {
                const contractItem = {
                    description: 'Test Contract Item',
                    priceUnit: 'Wochen',
                    pricePerUnit: 5000.00,
                    cashDiscountAllowed: true
                } as ContractItem;
                if (item) {
                    item.setItemDataFromContractItem(contractItem);
                    expect(item.description).toEqual(contractItem.description);
                    expect(item.quantityUnit).toEqual(contractItem.priceUnit);
                    expect(item.pricePerUnit).toEqual(contractItem.pricePerUnit);
                    expect(item.cashDiscountAllowed).toEqual(contractItem.cashDiscountAllowed);
                }
            });


        });
    });
});
