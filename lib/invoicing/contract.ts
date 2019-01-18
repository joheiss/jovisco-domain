import {Transaction, TransactionItem} from './transaction';
import {ContractData, ContractHeaderData, ContractItemData} from './contract-data.model';
import {DateTime, Interval} from 'luxon';
import {PaymentMethod} from './payment-method.model';
import {BillingMethod} from './billing-method.model';
import {DateUtility} from '../utils';

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
        const defaultValues = Contract.defaultValues();
        header.objectType = 'contracts';
        if (!header.issuedAt) {
            header.issuedAt = defaultValues.issuedAt;
        }
        if (!header.startDate) {
            header.startDate = defaultValues.startDate;
        }
        if (!header.endDate) {
            header.endDate = defaultValues.endDate;
        }
        if (!header.currency) {
            header.currency = defaultValues.currency;
        }
        if (header.budget === undefined) {
            header.budget = defaultValues.budget;
        }
        if (header.paymentMethod === undefined) {
            header.paymentMethod = defaultValues.paymentMethod;
        }
        if (header.billingMethod === undefined) {
            header.billingMethod = defaultValues.billingMethod;
        }
        if (header.cashDiscountDays === undefined) {
            header.cashDiscountDays = defaultValues.cashDiscountDays;
        }
        if (header.cashDiscountPercentage === undefined) {
            header.cashDiscountPercentage = defaultValues.cashDiscountPercentage;
        }
        if (header.dueDays === undefined) {
            header.dueDays = defaultValues.dueDays;
        }
        if (header.isDeletable === undefined) {
            header.isDeletable = defaultValues.isDeletable;
        }
        return header;
    }

    public static defaultValues(): ContractData {
        const today = DateUtility.getCurrentDate();
        return {
            objectType: 'contracts',
            issuedAt: today,
            startDate: DateUtility.getDefaultNextPeriodStartDate(today),
            endDate: DateUtility.getDefaultNextPeriodEndDate(today),
            paymentMethod: PaymentMethod.BankTransfer,
            billingMethod: BillingMethod.Invoice,
            budget: 0,
            currency: 'EUR',
            cashDiscountDays: 0,
            cashDiscountPercentage: 0,
            dueDays: 30,
            isDeletable: true,
            items: []
        };
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

    get durationInDays(): number {
        if (!this.header.startDate || !this.header.endDate) {
            return 0;
        }
        return DateUtility.getDurationInDays(this.header.startDate, this.header.endDate);
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
        const term = Interval.fromDateTimes(
            DateTime.fromJSDate(this.header.startDate),
            DateTime.fromJSDate(this.header.endDate)
        );
        return term.contains(DateTime.local());
    }

    public isFuture(): boolean {
        if (!this.header.startDate || !this.header.endDate) {
            return false;
        }
        const term = Interval.fromDateTimes(
            DateTime.fromJSDate(this.header.startDate),
            DateTime.fromJSDate(this.header.endDate)
        );
        return term.isAfter(DateTime.local());
    }

    public isInvoiceable(): boolean {
        if (!this.header.startDate || !this.header.endDate) {
            return false;
        }
        const term = Interval.fromDateTimes(
            DateTime.fromJSDate(this.header.startDate),
            DateTime.fromJSDate(this.header.endDate).plus({ days: 15})
        );
        return term.contains(DateTime.local());
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
