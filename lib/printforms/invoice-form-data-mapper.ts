import {IInvoiceFormData, IInvoiceItemFormData} from './invoice-form-data';
import {Invoice, InvoiceData, Receiver, ReceiverData} from '../invoicing';
import {DateUtility} from '../utils';

export class InvoiceFormDataMapper {

    private formData: IInvoiceFormData = {} as IInvoiceFormData;
    private readonly currencyOptions: any = {};
    private dateTimeFormat: Intl.DateTimeFormat;
    private numberFormat: Intl.NumberFormat;
    private currencyFormat: Intl.NumberFormat;
    private invoice: Invoice = {} as Invoice;
    private receiver: Receiver = {} as Receiver;

    constructor(invoice: InvoiceData,
                receiver: ReceiverData,
                private locale: string = 'de-DE',
                private currency: string = 'EUR') {

        this.invoice = Invoice.createFromData(invoice);
        this.receiver = Receiver.createFromData(receiver);

        this.currencyOptions = {
            style: 'currency',
            currency: this.currency,
            currencyDisplay: 'symbol'
        };

        this.dateTimeFormat = new Intl.DateTimeFormat(this.locale);
        this.numberFormat = new Intl.NumberFormat(this.locale);
        this.currencyFormat = new Intl.NumberFormat(this.locale, this.currencyOptions);
    }

    public map(): IInvoiceFormData {

        this.mapAddress();
        this.mapReference();
        this.mapPaymentTerms();
        this.mapText();
        this.mapItems();
        this.mapTotals();
        return this.formData;
    }

    private mapAddress(): void {

        this.formData.address = [];

        this.formData.address.push(this.receiver.header.name || '');
        this.formData.address.push(this.receiver.header.nameAdd || '');
        this.formData.address.push(this.receiver.address.street || '');
        this.formData.address.push(this.receiver.address.postalCode + ' ' + this.receiver.address.city);
    }

    private mapReference(): void {

        this.formData.invoiceId = this.invoice.header.id ? this.invoice.header.id.toString() : '';
        if (this.invoice.header.issuedAt) {
            this.formData.invoiceDate = this.dateTimeFormat.format(new Date(this.invoice.header.issuedAt));
        }
        this.formData.customerId = this.receiver.header.id ? this.receiver.header.id.toString() : '';
        this.formData.billingPeriod = this.invoice.header.billingPeriod || '';
    }

    private mapPaymentTerms(): void {

        this.formData.paymentTerms = this.invoice.header.paymentTerms || '';
    }

    private mapText(): void {

        this.formData.text = this.invoice.header.invoiceText || '';
    }

    private mapItems(): void {

        this.formData.items = [];

        if (this.invoice.items) {
            this.invoice.items.forEach(item => {
                const mappedItem: IInvoiceItemFormData = {} as IInvoiceItemFormData;
                mappedItem.itemId = item.id ? item.id.toString(): '';
                mappedItem.description = item.description || '';
                //mappedItem.quantity = item.quantity.toLocaleString(this.locale);
                mappedItem.quantity = item.quantity ?
                    this.numberFormat.format(item.quantity) :
                    this.numberFormat.format(0);
                // mappedItem.unitPrice = item.pricePerUnit.toLocaleString(this.locale, this.currencyOptions);
                mappedItem.unitPrice = item.pricePerUnit ?
                    this.currencyFormat.format(item.pricePerUnit) :
                    this.currencyFormat.format(0);
                const netValue = item.quantity * item.pricePerUnit;
                // mappedItem.netValue = netValue.toLocaleString(this.locale, this.currencyOptions);
                mappedItem.netValue = this.currencyFormat.format(netValue);
                this.formData.items.push(mappedItem);
            });
        }
    }

    private mapTotals(): void {

        this.formData.vatPercentage = this.invoice.vatPercentage.toString();
        this.formData.cashDiscountPercentage = this.invoice.cashDiscountPercentage.toString();
        if (this.invoice.header.issuedAt) {
            this.formData.cashDiscountDueDate = this.dateTimeFormat.format(
                DateUtility.addDaysToDate(this.invoice.header.issuedAt, this.invoice.header.cashDiscountDays || 0));
        }
        this.formData.totalNetValue = this.currencyFormat.format(this.invoice.netValue);
        this.formData.totalVatAmount = this.currencyFormat.format(this.invoice.vatAmount);
        this.formData.totalGrossAmount = this.currencyFormat.format(this.invoice.grossValue);
        this.formData.cashDiscountBaseAmount = this.currencyFormat.format(this.invoice.cashDiscountBaseAmount);
        this.formData.cashDiscountAmount = this.currencyFormat.format(this.invoice.cashDiscountAmount);
        this.formData.payableAmount = this.currencyFormat.format(this.invoice.paymentAmount);
    }
}

