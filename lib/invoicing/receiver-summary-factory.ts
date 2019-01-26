import {Receiver} from './receiver';
import {ReceiverSummary} from './receiver-summary';

export class ReceiverSummaryFactory {

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
}


