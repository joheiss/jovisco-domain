import {Transaction} from './transaction';
import {ContractData, ContractHeaderData, ContractItemData} from './contract-data.model';
import {PaymentMethod} from './payment-method.model';
import {BillingMethod} from './billing-method.model';
import {DateUtility} from '../utils';
import {ContractItem} from './contract-item';
import {ContractTerm} from './contract-term';

export class Contract extends Transaction {

    static createFromData(data: ContractData): Contract {
        if (!data) {
            throw new Error('invalid input');
        }
        const header = Contract.extractHeaderFromData(data);
        const items = data.items ? Contract.createItemsFromData(data.items) : [];
        return new Contract(header, items);
    }

    static defaultValues(): any {
        const today = DateUtility.getCurrentDate();
        return {
            objectType: 'contracts',
            issuedAt: today,
            term: ContractTerm.getNextDefaultTerm(today),
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
        return Object.assign({}, Contract.defaultValues(), header) as ContractHeaderData;
    }

    private constructor(public header: ContractHeaderData, public items: ContractItem[]) {
        super();
        this.items.forEach(item => item.headerRef = this);
    }

    get data(): ContractData {
        return {
            ...this.header,
            items: this.getItemsData()
        };
    }

    get term(): ContractTerm {
        return this.header.term;
    }

    buildNewItemFromTemplate(): ContractItem {
        return {id: this.getNextItemId()} as ContractItem;
    }

}

