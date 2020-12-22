import {ContractData, ContractHeaderData} from './contract-data.model';
import {Contract} from './contract';
import {ContractItemFactory} from './contract-item-factory';
import {ContractsEntity} from './contracts-entity';

export class ContractFactory {

    static fromData(data: ContractData): Contract {
        if (!data) throw new Error('invalid input');
        const header = ContractFactory.extractHeaderFromData(data);
        const items = data.items ? ContractItemFactory.fromDataArray(data.items) : [];
        return new Contract(header, items);
    }

    static fromDataArray(contracts: ContractData []): Contract[] {
        return contracts.map(c => ContractFactory.fromData(c));
    }

    static fromEntity(entity: ContractsEntity): Contract[] {
        return Object.keys(entity).map(id => ContractFactory.fromData(entity[id]));
    }

    private static extractHeaderFromData(data: ContractData): ContractHeaderData {
        const {items: removed1, ...header} = data;
        return Object.assign({}, Contract.defaultValues(), header) as ContractHeaderData;
    }
}
