import {Transaction} from './transaction';
import {InvoiceData, InvoiceHeaderData, InvoiceItemData} from './invoice-data.model';
import {InvoiceStatus} from './invoice-status.model';
import {DateTime} from 'luxon';
import {BillingMethod} from './billing-method.model';
import {PaymentMethod} from './payment-method.model';
import {Contract} from './contract';
import {DateUtility} from '../utils';
import {InvoiceItem} from './invoice-item';
import {ContractItem} from './contract-item';

export class Invoice extends Transaction {

    public static createFromContract(contract: Contract): Invoice {

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
        return Invoice.createFromData(data);
    }

    public static createFromData(data: InvoiceData): Invoice {
        if (!data) {
            throw new Error('invalid input');
        }
        const header = Invoice.extractHeaderFromData(data);
        const items = data.items ? Invoice.createItemsFromData(data.items) : [];
        return new Invoice(header, items);
    }

    public static defaultValues(): any {
        return {
            objectType: 'invoices',
            issuedAt: DateUtility.getCurrentDate(),
            status: InvoiceStatus.created,
            paymentTerms: '30 Tage: netto',
            paymentMethod: PaymentMethod.BankTransfer,
            billingMethod: BillingMethod.Invoice,
            currency: 'EUR',
            cashDiscountDays: 0,
            cashDiscountPercentage: 0,
            dueInDays: 30,
            vatPercentage: 19.0,
            isDeletable: true,
            items: []
        };
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
        const {items: removed1, ...header} = data;
        const defaultValues = Invoice.defaultValues();
        if (!header.objectType) {
            header.objectType = defaultValues.objectType;
        }
        if (header.billingMethod === undefined) {
            header.billingMethod = defaultValues.billingMethod;
        }
        if (header.paymentMethod === undefined) {
            header.paymentMethod = defaultValues.paymentMethod;
        }
        if (!header.paymentTerms) {
            header.paymentTerms = defaultValues.paymentTerms;
        }
        if (!header.issuedAt) {
            header.issuedAt = defaultValues.issuedAt;
        }
        if (header.status === undefined) {
            header.status = defaultValues.status;
        }
        if (!header.currency) {
            header.currency = defaultValues.currency;
        }
        if (header.vatPercentage === undefined) {
            header.vatPercentage = defaultValues.vatPercentage;
        }
        if (header.cashDiscountDays === undefined) {
            header.cashDiscountDays = defaultValues.cashDiscountDays;
        }
        if (header.cashDiscountPercentage === undefined) {
            header.cashDiscountPercentage = defaultValues.cashDiscountPercentage;
        }
        if (header.dueInDays === undefined) {
            header.dueInDays = defaultValues.dueInDays;
        }
        return header;
    }

    constructor(public header: InvoiceHeaderData, public items: InvoiceItem[]) {
        super();
    }

    get data(): InvoiceData {
        return {
            ...this.header,
            items: this.getItemsData()
        };
    }

    get cashDiscountAmount(): number {
        return this.items.reduce((sum, item) => sum + item.getCashDiscountValue(this.cashDiscountPercentage), 0);
    }

    get cashDiscountBaseAmount(): number {
        return this.items.reduce((sum, item) => sum + item.discountableValue, 0);
    }

    get cashDiscountDate(): Date {
        const issuedAt = this.header.issuedAt ? DateTime.fromJSDate(this.header.issuedAt) : DateTime.local();
        return issuedAt.plus({days: this.header.cashDiscountDays}).toJSDate();
    }

    get cashDiscountPercentage(): number {
        return this.header.cashDiscountPercentage || 0;
    }

    get discountedNetValue(): number {
        return this.items.reduce((sum, item) => sum + item.getDiscountedNetValue(this.cashDiscountPercentage), 0);
    }

    get dueDate(): Date {
        const issuedAt = this.header.issuedAt ?
            DateTime.fromJSDate(this.header.issuedAt) :
            DateTime.fromJSDate(DateUtility.getCurrentDate());
        return issuedAt.plus({days: this.header.dueInDays}).toJSDate();
    }

    get grossValue(): number {
        return this.netValue + this.vatAmount;
    }

    get netValue(): number {
        return this.items.reduce((sum, item) => sum + item.netValue, 0);
    }

    get paymentAmount(): number {
        return this.items.reduce((sum, item) => sum + item.getDiscountedValue(this.cashDiscountPercentage), 0);
    }

    get revenuePeriod(): { year: number, month: number } {

        const issuedAt = this.header.issuedAt ?
            DateTime.fromJSDate(this.header.issuedAt) :
            DateTime.fromJSDate(DateUtility.getCurrentDate());

        if (issuedAt.day > 15) {
            return {year: issuedAt.year, month: issuedAt.month};
        }
        const previousMonth = issuedAt.minus({months: 1});
        return {year: previousMonth.year, month: previousMonth.month};
    }

    get vatAmount(): number {
        return this.netValue * this.vatPercentage / 100;
    }

    get vatPercentage(): number {
        return this.header.vatPercentage || 19;
    }

    set vatPercentage(newValue: number) {
        this.header.vatPercentage = newValue;
    }

    public buildNewItemFromTemplate(): InvoiceItem {
        const id = this.getNextItemId();
        // build item template
        return InvoiceItem.createFromData({
            id,
            contractItemId: undefined,
            description: undefined,
            quantity: 0,
            quantityUnit: undefined,
            pricePerUnit: 0,
            cashDiscountAllowed: false,
            vatPercentage: this.vatPercentage
        });
    }

    public getItem(itemId: number): InvoiceItem | undefined {
        return this.items.find(item => item.data.id === itemId);
    }

    public isBilled(): boolean {
        return this.header.status === InvoiceStatus.billed;
    }

    public isDue(): boolean {
        const due = DateTime.fromJSDate(this.dueDate);
        return this.header.status !== InvoiceStatus.paid && due <= DateTime.local().startOf('day');
    }

    public isOpen(): boolean {
        return this.header.status !== InvoiceStatus.paid;
    }

    public isPaid(): boolean {
        return this.header.status === InvoiceStatus.paid;
    }

    public setContractRelatedData(contract: Contract): void {
        this.setHeaderDataFromContract(contract);
        if (this.items && this.items.length) {
            this.items.forEach((item: InvoiceItem) => {
                const contractItem: ContractItem = contract.getItem(item.contractItemId);
                if (contractItem) {
                    item.setItemDataFromContractItem(contractItem);
                }
            });
        } else {
            const contractItem: ContractItem = contract.getItem(1);
            if (contractItem) {
                const item: InvoiceItem = InvoiceItem.createFromData({
                    id: 1,
                    contractItemId: contractItem.id,
                    description: contractItem.description,
                    pricePerUnit: contractItem.pricePerUnit,
                    cashDiscountAllowed: contractItem.cashDiscountAllowed,
                    quantityUnit: contractItem.priceUnit,
                    quantity: 0,
                    vatPercentage: this.header.vatPercentage
                });
                this.items.push(item);
            }
        }
    }

    public setHeaderDataFromContract(contract: Contract): void {
        this.header.receiverId = contract.header.customerId;
        this.header.billingMethod = contract.header.billingMethod;
        this.header.paymentMethod = contract.header.paymentMethod;
        this.header.paymentTerms = contract.header.paymentTerms;
        this.header.cashDiscountPercentage = contract.header.cashDiscountPercentage;
        this.header.cashDiscountDays = contract.header.cashDiscountDays;
        this.header.dueInDays = contract.header.dueDays;
        this.header.invoiceText = contract.header.invoiceText;
    }
}

