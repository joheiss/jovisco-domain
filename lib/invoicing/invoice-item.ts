import {TransactionItem} from './transaction';
import {InvoiceItemData} from './invoice-data.model';
import {ContractItem} from './contract-item';

export class InvoiceItem extends TransactionItem {

    static createFromData(data: InvoiceItemData): InvoiceItem {
        return new InvoiceItem(data);
    }

    static defaultValues(): any {
        return {
            quantity: 0,
            pricePerUnit: 0,
            cashDiscountAllowed: false
        } as InvoiceItemData;
    }

    private constructor(protected _data: InvoiceItemData) {
        super(_data);
        this.fill(_data);
    }

    get contractItemId(): number | undefined {
        return this._data.contractItemId;
    }
    set contractItemId(value: number | undefined) {
        this._data.contractItemId = value;
    }
    get description(): string | undefined {
        return this._data.description;
    }
    set description(value: string | undefined) {
        this._data.description = value;
    }
    get quantity(): number | undefined {
        return this._data.quantity;
    }
    set quantity(value: number | undefined) {
        this._data.quantity = value;
    }
    get quantityUnit(): string | undefined {
        return this._data.quantityUnit;
    }
    set quantityUnit(value: string | undefined) {
        this._data.quantityUnit = value;
    }
    get pricePerUnit(): number  | undefined {
        return this._data.pricePerUnit;
    }
    set pricePerUnit(value: number | undefined) {
        this._data.pricePerUnit = value;
    }
    get cashDiscountAllowed(): boolean  | undefined {
        return this._data.cashDiscountAllowed;
    }
    set cashDiscountAllowed(value: boolean | undefined) {
        this._data.cashDiscountAllowed = value;
    }
    get vatPercentage(): number {
        return this._data.vatPercentage || 0;
    }
    set vatPercentage(value: number) {
        this._data.vatPercentage = value;
    }

    get data(): InvoiceItemData {
        return this._data;
    }

    get discountableValue(): number {
        return this.cashDiscountAllowed ? this.grossValue : 0;
    }

    get grossValue(): number {
        return this.netValue + this.vatValue;
    }

    get netValue(): number {
        return this.quantity && this.pricePerUnit ? this.quantity * this.pricePerUnit : 0;
    }

    get vatValue(): number {
        return this.vatPercentage ? this.netValue * this.vatPercentage / 100 : 0;
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

    setItemDataFromContractItem(contractItem: ContractItem): void {
        this._data.description = contractItem.description;
        this._data.quantityUnit = contractItem.priceUnit;
        this._data.pricePerUnit = contractItem.pricePerUnit;
        this._data.cashDiscountAllowed = contractItem.cashDiscountAllowed;
    }

    protected fill(data: InvoiceItemData) {
        this._data = Object.assign({}, InvoiceItem.defaultValues(), data);
    }
}

