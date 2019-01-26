import {Receiver} from './receiver';
import {ContractsEntity} from './contracts-entity';
import {InvoicesEntity} from './invoices-entity';
import {ReceiverSummaryData} from './receiver-summary-data.model';
import {ContractFactory} from './contract-factory';
import {InvoiceFactory} from './invoice-factory';

export class ReceiverSummary {

    static create(receiver: Receiver): ReceiverSummary {

        const data = {
            object: receiver,
            deletable: false,
            activeContractsCount: 0,
            expiredContractsCount: 0,
            lastContractId: '',
            dueInvoicesCount: 0,
            openInvoicesCount: 0,
            lastInvoiceId: ''
        };
        return new ReceiverSummary(data);
    }

    constructor(private _data: ReceiverSummaryData) {
    }

    get object(): Receiver {
        return this._data.object;
    }

    get deletable(): boolean {
        return this._data.lastContractId.length + this._data.lastInvoiceId.length > 0;
    }

    get activeContractsCount(): number {
        return this._data.activeContractsCount;
    }

    get expiredContractsCount(): number {
        return this._data.expiredContractsCount;
    }

    get lastContractId(): string {
        return this._data.lastContractId
    }

    get dueInvoicesCount(): number {
        return this._data.dueInvoicesCount;
    }

    get openInvoicesCount(): number {
        return this._data.openInvoicesCount;
    }

    get lastInvoiceId(): string {
        return this._data.lastInvoiceId
    }

    get data(): ReceiverSummaryData {
        this._data.deletable = this.deletable;
        return this._data;
    }

    setContractInfos(contracts: ContractsEntity): ReceiverSummary {

        Object.keys(contracts)
            .filter(contractId => contracts[contractId].customerId === this._data.object.header.id)
            .forEach(contractId => {
                const contract = ContractFactory.fromData(contracts[contractId]);
                // get counts for active and expired contracts
                if (contract.term.isActive || contract.term.isFuture) {
                    ++this._data.activeContractsCount;
                } else {
                    ++this._data.expiredContractsCount;
                }
                // get last contract Id
                if (contractId > this._data.lastContractId) {
                    this._data.lastContractId = contractId;
                }
            });

        return this;
    }

    setInvoiceInfos(invoices: InvoicesEntity): ReceiverSummary {

        Object.keys(invoices)
            .filter(invoiceId => invoices[invoiceId].receiverId === this._data.object.header.id)
            .forEach(invoiceId => {
                const invoice = InvoiceFactory.fromData(invoices[invoiceId]);
                // get counts for open and due invoices
                if (invoice.isDue()) {
                    this._data.dueInvoicesCount++;
                }
                if (invoice.isOpen()) {
                    this._data.openInvoicesCount++;
                }
                // get last invoice Id
                if (invoiceId > this._data.lastInvoiceId) {
                    this._data.lastInvoiceId = invoiceId;
                }
            });

        return this;
    }
}
