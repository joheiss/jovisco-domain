import {Contract} from './contract';
import {ContractSummary} from './contract-summary';

export class ContractSummaryFactory {

    static fromContract(contract: Contract): ContractSummary {

        const data = {
            object: contract,
            receiverName: '',
            revenue: 0,
            changeable: false,
            lastInvoiceId: ''
        };
        return new ContractSummary(data);
    }

}
