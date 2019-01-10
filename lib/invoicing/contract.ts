import {Transaction, TransactionItem} from './transaction';
import {ContractData, ContractHeaderData, ContractItemData} from './contract-data.model';

export class Contract extends Transaction {

    public static createFromData(data: ContractData) {
        if (!data) {
            throw new Error('invalid input');
        }
        const header = Contract.extractHeaderFromData(data);
        const items = data.items ? Contract.createItemsFromData(data.items) : [];
        return new Contract(header, items);
    }

    private static createItemsFromData(items: ContractItemData[]): ContractItem[] {
        if (items.length) {
            return items
                .filter(item => !!item)
                .map(item => ContractItem.createFromData(item));
        } else {
            return [];
        }
    }

    private static extractHeaderFromData(data: ContractData): ContractHeaderData {
        const {items: removed1, ...header} = data;
        if (!header.objectType) {
            header.objectType = 'contracts';
        }
        if (data.issuedAt) {
            header.issuedAt = new Date(data.issuedAt);
        }
        if (data.startDate) {
            header.startDate = new Date(data.startDate);
        }
        if (data.endDate) {
            header.endDate = new Date(data.endDate);
        }
        return header;
    }

    constructor(public header: ContractHeaderData,
                public items: ContractItem[]) {
        super();
    }


    get data(): ContractData {
        return {
            ...this.header,
            items: this.getItemsData()
        };
    }

    public buildNewItemFromTemplate(): ContractItem {
        // get next item number
        const id = this.getNextItemId();
        // build item template
        return {id} as ContractItem;
    }

    public isActive(): boolean {
        if (!this.header.startDate || !this.header.endDate) {
            return false;
        }
        const now = new Date();
        const start = new Date(this.header.startDate);
        const end = new Date(this.header.endDate);
        return start <= now && end >= now;
    }

    public isFuture(): boolean {
        if (!this.header.startDate || !this.header.endDate) {
            return false;
        }
        const now = new Date();
        const start = new Date(this.header.startDate);
        const end = new Date(this.header.endDate);
        return start > now && end > now;
    }

    public isInvoiceable(): boolean {
        if (!this.header.startDate || !this.header.endDate) {
            return false;
        }
        const now = new Date();
        const start = new Date(this.header.startDate);
        const end = new Date(this.header.endDate);
        end.setMonth(end.getMonth() + 1);
        return start <= now && end >= now;
    }
}

export class ContractItem extends TransactionItem {
    private _description: string | undefined;
    private _pricePerUnit: number | undefined;
    private _priceUnit: string | undefined;
    private _cashDiscountAllowed: boolean | undefined;

    static createFromData(data: ContractItemData): ContractItem {
        return new ContractItem(data);
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
        if (data.pricePerUnit) {
            this._pricePerUnit = data.pricePerUnit;
        }
        if (data.priceUnit) {
            this._priceUnit = data.priceUnit;
        }
        if (data.cashDiscountAllowed) {
            this._cashDiscountAllowed = data.cashDiscountAllowed;
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
