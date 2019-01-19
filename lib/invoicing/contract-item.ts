import {TransactionItem} from './transaction';
import {ContractItemData} from './contract-data.model';

export class ContractItem extends TransactionItem {
    private _description: string | undefined;
    private _pricePerUnit: number | undefined;
    private _priceUnit: string | undefined;
    private _cashDiscountAllowed: boolean | undefined;

    static createFromData(data: ContractItemData): ContractItem {
        return new ContractItem(data);
    }

    static defaultValues(): any {
        return {
            pricePerUnit: 0
        };
    }

    constructor(data?: ContractItemData) {
        super();
        this.initialize();
        this.fill(data);
    }

    get description(): string {
        return this._description || '';
    }

    set description(value: string) {
        this._description = value;
    }

    get pricePerUnit(): number {
        return this._pricePerUnit || 0;
    }

    set pricePerUnit(value: number) {
        this._pricePerUnit = value;
    }

    get priceUnit(): string {
        return this._priceUnit || '';
    }

    set priceUnit(value: string) {
        this._priceUnit = value;
    }

    get cashDiscountAllowed(): boolean {
        return this._cashDiscountAllowed || false
    }

    set cashDiscountAllowed(value: boolean) {
        this._cashDiscountAllowed = value;
    }

    get data(): ContractItemData {
        return {
            id: this._id,
            description: this._description,
            pricePerUnit: this._pricePerUnit,
            priceUnit: this._priceUnit,
            cashDiscountAllowed: this._cashDiscountAllowed
        };
    }

    protected fill(data?: ContractItemData): void {
        if (!data) {
            return;
        }
        if (data.id) {
            this._id = data.id;
        }
        if (data.description) {
            this._description = data.description;
        }
        this._pricePerUnit = data.pricePerUnit;
        if (this._pricePerUnit === undefined) {
            this._pricePerUnit = 0;
        }
        if (data.priceUnit) {
            this._priceUnit = data.priceUnit;
        }
        this._cashDiscountAllowed = data.cashDiscountAllowed;
        if (this._cashDiscountAllowed === undefined) {
            this._cashDiscountAllowed = false;
        }
    }

    protected initialize(): void {
        this._id = undefined;
        this._description = undefined;
        this._pricePerUnit = 0;
        this._priceUnit = undefined;
        this._cashDiscountAllowed = false;
    }
}
