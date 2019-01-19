import {TransactionItem} from './transaction';
import {InvoiceItemData} from './invoice-data.model';

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

    static defaultValues(): any {
        return {
            contractItemId: 0,
            quantity: 0,
            pricePerUnit: 0
        } as InvoiceItemData;
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

    getDiscountedNetValue(cashDiscountPercentage: number): number {
        if (this.cashDiscountAllowed && cashDiscountPercentage > 0) {
            return this.getDiscountedValue(cashDiscountPercentage) * 100 / ( 100 + this.vatPercentage);
        }
        return this.netValue;
    }

    getDiscountedValue(cashDiscountPercentage: number): number {
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

