import {mockInvoice, mockReceiver} from './mock.factory';
import {InvoiceForm, InvoiceFormDataMapper} from '../lib/printforms';

describe('printforms tests', () => {
    it('should map the form data from invoice and receiver', () => {
        const invoice = mockInvoice();
        const receiver = mockReceiver();
        const formData = new InvoiceFormDataMapper(invoice.data, receiver.data).map();
        console.log('Form data: ', formData);
        const form = new InvoiceForm(formData);
        expect(formData).toBeTruthy();
        console.log('Invoice form: ', form);
        expect(form).toBeTruthy();
    });
});
