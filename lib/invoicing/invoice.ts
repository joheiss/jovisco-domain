import { Transaction } from './transaction';
import { InvoiceData, InvoiceHeaderData } from './invoice-data.model';
import { InvoiceStatus } from './invoice-status.model';
import { DateTime } from 'luxon';
import { BillingMethod } from './billing-method.model';
import { PaymentMethod } from './payment-method.model';
import { Contract } from './contract';
import { DateUtility } from '../utils';
import { InvoiceItem } from './invoice-item';
import { ContractItem } from './contract-item';
import { InvoiceItemFactory } from './invoice-item-factory';

export class Invoice extends Transaction {
    static defaultValues(): any {
        return {
            objectType: 'invoices',
            issuedAt: DateUtility.getCurrentDate(),
            status: InvoiceStatus.created,
            paymentTerms: '30 Tage: netto',
            paymentMethod: PaymentMethod.BankTransfer,
            billingMethod: BillingMethod.Invoice,
            currency: 'EUR',
            cashDiscountDays: 0,
            cashDiscountPercentage: 0,
            dueInDays: 30,
            vatPercentage: 19.0,
            isDeletable: true,
            items: [],
        };
    }

    constructor(public header: InvoiceHeaderData, public items: InvoiceItem[]) {
        super();
    }

    get data(): InvoiceData {
        return {
            ...this.header,
            items: this.getItemsData(),
        };
    }

    get cashDiscountAmount(): number {
        return this.items.reduce(
            (sum, item) =>
                sum + item.getCashDiscountValue(this.cashDiscountPercentage),
            0
        );
    }

    get cashDiscountBaseAmount(): number {
        return this.items.reduce(
            (sum, item) => sum + item.discountableValue,
            0
        );
    }

    get cashDiscountDate(): Date {
        const issuedAt = this.header.issuedAt
            ? DateTime.fromJSDate(this.header.issuedAt)
            : DateTime.local();
        return issuedAt.plus({ days: this.header.cashDiscountDays }).toJSDate();
    }

    get cashDiscountPercentage(): number {
        return this.header.cashDiscountPercentage || 0;
    }

    get discountedNetValue(): number {
        return this.items.reduce(
            (sum, item) =>
                sum + item.getDiscountedNetValue(this.cashDiscountPercentage),
            0
        );
    }

    get dueDate(): Date {
        const issuedAt = this.header.issuedAt
            ? DateTime.fromJSDate(this.header.issuedAt)
            : DateTime.fromJSDate(DateUtility.getCurrentDate());
        return issuedAt.plus({ days: this.header.dueInDays }).toJSDate();
    }

    get grossValue(): number {
        return this.netValue + this.vatAmount;
    }

    get netValue(): number {
        return this.items.reduce((sum, item) => sum + item.netValue, 0);
    }

    get paymentAmount(): number {
        return this.items.reduce(
            (sum, item) =>
                sum + item.getDiscountedValue(this.cashDiscountPercentage),
            0
        );
    }

    get revenuePeriod(): { year: number; month: number } {
        const issuedAt = this.header.issuedAt
            ? DateTime.fromJSDate(this.header.issuedAt)
            : DateTime.fromJSDate(DateUtility.getCurrentDate());

        if (issuedAt.day > 15) {
            return { year: issuedAt.year, month: issuedAt.month };
        }
        const previousMonth = issuedAt.minus({ months: 1 });
        return { year: previousMonth.year, month: previousMonth.month };
    }

    get vatAmount(): number {
        return (this.netValue * this.vatPercentage) / 100;
    }

    get vatPercentage(): number {
        return this.header.vatPercentage || 19;
    }

    set vatPercentage(newValue: number) {
        this.header.vatPercentage = newValue;
    }

    buildNewItemFromTemplate(): InvoiceItem {
        return InvoiceItemFactory.fromData({
            ...InvoiceItem.defaultValues(),
            id: this.getNextItemId(),
            vatPercentage: this.vatPercentage,
        });
    }

    getItem(itemId: number): InvoiceItem | undefined {
        return this.items.find((item) => item.data.id === itemId);
    }

    isBilled(): boolean {
        return this.header.status === InvoiceStatus.billed;
    }

    isDue(): boolean {
        const due = DateTime.fromJSDate(this.dueDate);
        return (
            this.header.status !== InvoiceStatus.paid &&
            due <= DateTime.local().startOf('day')
        );
    }

    isOpen(): boolean {
        return this.header.status !== InvoiceStatus.paid;
    }

    isPaid(): boolean {
        return this.header.status === InvoiceStatus.paid;
    }

    setContractRelatedData(contract: Contract): Invoice {
        this.setHeaderDataFromContract(contract);
        if (this.items && this.items.length) {
            this.items.forEach((item: InvoiceItem) => {
                if (item.contractItemId) {
                    const contractItem: ContractItem = contract.getItem(
                        item.contractItemId
                    );
                    if (contractItem) {
                        item.setItemDataFromContractItem(contractItem);
                    }
                }
            });
        } else {
            const contractItem: ContractItem = contract.getItem(1);
            if (contractItem) {
                const item: InvoiceItem = InvoiceItemFactory.fromData({
                    id: 1,
                    contractItemId: contractItem.id,
                    description: contractItem.description,
                    pricePerUnit: contractItem.pricePerUnit,
                    cashDiscountAllowed: contractItem.cashDiscountAllowed,
                    quantityUnit: contractItem.priceUnit,
                    quantity: 0,
                    vatPercentage: this.header.vatPercentage,
                });
                this.items.push(item);
            }
        }
        return this;
    }

    setHeaderDataFromContract(contract: Contract): Invoice {
        this.header.receiverId = contract.header.customerId;
        this.header.billingMethod = contract.header.billingMethod;
        this.header.paymentMethod = contract.header.paymentMethod;
        this.header.paymentTerms = contract.header.paymentTerms;
        this.header.cashDiscountPercentage =
            contract.header.cashDiscountPercentage;
        this.header.cashDiscountDays = contract.header.cashDiscountDays;
        this.header.dueInDays = contract.header.dueDays;
        this.header.invoiceText = contract.header.invoiceText;
        return this;
    }

    setVatPercentage(percentage: number): Invoice {
        this.header.vatPercentage = percentage;
        return this;
    }
}
