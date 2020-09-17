import {Transaction} from './transaction';
import {ContractData, ContractHeaderData} from './contract-data.model';
import {PaymentMethod} from './payment-method.model';
import {BillingMethod} from './billing-method.model';
import {DateUtility} from '../utils';
import {ContractItem} from './contract-item';
import {ContractTerm} from './contract-term';
import {ContractTermFactory} from './contract-term-factory';

export class Contract extends Transaction {

    static defaultValues(): any {
        const today = DateUtility.getCurrentDate();
        return {
            objectType: 'contracts',
            issuedAt: today,
            term: ContractTermFactory.nextDefaultTerm(today),
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

     constructor(public header: ContractHeaderData, public items: ContractItem[]) {
        super();
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

