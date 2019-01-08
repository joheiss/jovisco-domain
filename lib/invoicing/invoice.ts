import {Transaction, TransactionItem} from './transaction';
import {InvoiceData, InvoiceHeaderData, InvoiceItemData} from './invoice-data.model';
import {InvoiceStatus} from './invoice-status.model';
import {DateTime} from 'luxon';

export class Invoice extends Transaction {

    public static createFromData(data: InvoiceData) {
        if (data) {
            const header = Invoice.extractHeaderFromData(data);
            const items = data.items ? Invoice.createItemsFromData(data.items) : [];
            return new Invoice(header, items);
        }
        return undefined;
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
        if (data.issuedAt) {
            header.issuedAt = new Date(data.issuedAt);
        }
        return header;
    }

    constructor(public header: InvoiceHeaderData,
                public items: InvoiceItem[]) {
        super();
    }

    get data(): InvoiceData {
        return {
            ...this.header,
            items: this.getItemsData()
        };
    }

    get cashDiscountAmount(): number {
        return this.items.reduce((sum, item) => sum + item.getCashDiscountValue(this.data.cashDiscountPercentage || 0), 0);
    }

    get cashDiscountBaseAmount(): number {
        return this.items.reduce((sum, item) => sum + item.discountableValue, 0);
    }

    get cashDiscountDate(): Date {
        const issuedAt = this.header.issuedAt ? DateTime.fromJSDate(this.header.issuedAt) : DateTime.local();
        return issuedAt.plus({days: this.header.cashDiscountDays}).toJSDate();
    }

    get dueDate(): Date {
        const issuedAt = this.header.issuedAt ? DateTime.fromJSDate(this.header.issuedAt) : DateTime.local();
        return issuedAt.plus({days: this.header.dueInDays}).toJSDate();
    }

    get grossValue(): number {
        return this.netValue + this.vatAmount;
    }

    get netValue(): number {
        return this.items.reduce((sum, item) => sum + item.netValue, 0);
    }

    get paymentAmount(): number {
        return this.items.reduce((sum, item) => sum + item.getDiscountedValue(this.data.cashDiscountPercentage || 0), 0);
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
        const now = new Date();
        const due = new Date(this.dueDate);
        return this.header.status !== InvoiceStatus.paid && due <= now;
    }

    public isOpen(): boolean {
        return this.header.status !== InvoiceStatus.paid;
    }

    public isPaid(): boolean {
        return this.header.status === InvoiceStatus.paid;
    }
}

export class InvoiceItem extends TransactionItem {

    protected _contractItemId: number | undefined;
    protected _description: string | undefined;
    protected _quantity: number | undefined;
    protected _quantityUnit: string | undefined;
    protected _pricePerUnit: number | undefined;
    protected _cashDiscountAllowed: boolean | undefined;
    protected _vatPercentage: number | undefined;

    static createFromData(data: InvoiceItemData): InvoiceItem {
        return new InvoiceItem(data);
    }

    constructor(data?: InvoiceItemData) {
        super();
        this.initialize();
        this.fill(data);
    }

    get contractItemId(): number {
        return this._contractItemId || 0;
    }

    set contractItemId(value: number) {
        this._contractItemId = value;
    }

    get description(): string {
        return this._description || '';
    }

    set description(value: string) {
        this._description = value;
    }

    get quantity(): number {
        return this._quantity || 0;
    }

    set quantity(value: number) {
        this._quantity = value;
    }

    get quantityUnit(): string {
        return this._quantityUnit || '';
    }

    set quantityUnit(value: string) {
        this._quantityUnit = value;
    }

    get pricePerUnit(): number {
        return this._pricePerUnit || 0;
    }

    set pricePerUnit(value: number) {
        this._pricePerUnit = value;
    }

    get cashDiscountAllowed(): boolean {
        return this._cashDiscountAllowed || false;
    }

    set cashDiscountAllowed(value: boolean) {
        this._cashDiscountAllowed = value;
    }

    get vatPercentage(): number {
        return this._vatPercentage || 0;
    }

    set vatPercentage(value: number) {
        this._vatPercentage = value;
    }

    get data(): InvoiceItemData {
        return {
            id: this.id,
            contractItemId: this.contractItemId,
            description: this.description,
            quantity: this.quantity,
            quantityUnit: this.quantityUnit,
            pricePerUnit: this.pricePerUnit,
            cashDiscountAllowed: this.cashDiscountAllowed,
            vatPercentage: this.vatPercentage
        };
    }

    get discountableValue(): number {
        return this.cashDiscountAllowed ? this.grossValue : 0;
    }

    get grossValue(): number {
        return this.netValue + this.vatValue;
    }

    get netValue(): number {
        return this.quantity * this.pricePerUnit;
    }

    get vatValue(): number {
        return this.netValue * this.vatPercentage / 100;
    }

    getCashDiscountValue(cashDiscountPercentage: number): number {
        return this.cashDiscountAllowed ? this.grossValue * cashDiscountPercentage / 100 : 0;
    }

    public getDiscountedValue(cashDiscountPercentage: number): number {
        return this.grossValue - this.getCashDiscountValue(cashDiscountPercentage);
    }

    protected fill(data?: InvoiceItemData) {
        if (!data) {
            return;
        }
        if (data.id) {
            this._id = data.id;
        }
        if (data.contractItemId) {
            this._contractItemId = data.contractItemId;
        }
        if (data.description) {
            this._description = data.description;
        }
        if (data.quantity) {
            this._quantity = data.quantity;
        }
        if (data.quantityUnit) {
            this._quantityUnit = data.quantityUnit;
        }
        if (data.pricePerUnit) {
            this._pricePerUnit = data.pricePerUnit;
        }
        if (data.cashDiscountAllowed) {
            this._cashDiscountAllowed = data.cashDiscountAllowed;
        }
        if (data.vatPercentage) {
            this._vatPercentage = data.vatPercentage;
        }
    }

    protected initialize() {
        this._id = undefined;
        this._contractItemId = undefined;
        this._description = undefined;
        this._quantity = 0;
        this._quantityUnit = undefined;
        this._pricePerUnit = 0;
        this._cashDiscountAllowed = false;
        this._vatPercentage = 19.0;
    }
}
