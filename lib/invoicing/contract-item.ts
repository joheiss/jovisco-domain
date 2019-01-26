import {TransactionItem} from './transaction';
import {ContractItemData} from './contract-data.model';

export class ContractItem extends TransactionItem {

    static defaultValues(): any {
        return {
            pricePerUnit: 0,
            cashDiscountAllowed: false
        };
    }

    constructor(protected _data: ContractItemData) {
        super(_data);
        this.fill(_data);
    }

    get description(): string | undefined{
        return this._data.description;
    }

    set description(value: string | undefined) {
        this._data.description = value;
    }

    get pricePerUnit(): number | undefined {
        return this._data.pricePerUnit;
    }

    set pricePerUnit(value: number | undefined) {
        this._data.pricePerUnit = value;
    }

    get priceUnit(): string | undefined {
        return this._data.priceUnit;
    }

    set priceUnit(value: string | undefined) {
        this._data.priceUnit = value;
    }

    get cashDiscountAllowed(): boolean | undefined {
        return this._data.cashDiscountAllowed;
    }

    set cashDiscountAllowed(value: boolean | undefined) {
        this._data.cashDiscountAllowed = value;
    }
    get data(): ContractItemData {
        return this._data;
    }

    protected fill(data: ContractItemData): void {
        this._data = Object.assign({}, ContractItem.defaultValues(), data);
    }
}
