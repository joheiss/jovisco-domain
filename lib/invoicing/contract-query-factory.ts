import {ContractQuery} from './contract-query';
import {Contract} from './contract';

export class ContractQueryFactory {

    static fromContract(contract: Contract): ContractQuery {
        return new ContractQuery(contract);
    }
}
