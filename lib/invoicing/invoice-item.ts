import {TransactionItem} from './transaction';
import {InvoiceItemData} from './invoice-data.model';
import {ContractItem} from './contract-item';
import {Invoice} from './invoice';

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
    get vatPercentage(): number  | undefined {
        return this._data.vatPercentage;
    }
    set vatPercentage(value: number | undefined) {
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

    get cashDiscountValue(): number {
        return this.headerRef && this.cashDiscountAllowed ? this.grossValue * this.headerRef.cashDiscountPercentage / 100 : 0;
    }

    get discountedNetValue(): number {
        if (this.cashDiscountAllowed && this.headerRef && this.headerRef.cashDiscountPercentage > 0 && this.vatPercentage) {
            return this.discountedValue * 100 / ( 100 + this.vatPercentage);
        }
        return this.netValue;
    }

    get discountedValue(): number {
        return this.grossValue - this.cashDiscountValue;
    }

    setItemDataFromContractItem(contractItem: ContractItem): Invoice {
        this._data.description = contractItem.description;
        this._data.quantityUnit = contractItem.priceUnit;
        this._data.pricePerUnit = contractItem.pricePerUnit;
        this._data.cashDiscountAllowed = contractItem.cashDiscountAllowed;
        return this.headerRef;
    }

    protected fill(data: InvoiceItemData) {
        this._data = Object.assign({}, InvoiceItem.defaultValues(), data);
    }
}

