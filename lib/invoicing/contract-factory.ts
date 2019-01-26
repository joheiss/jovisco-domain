import {ContractData, ContractHeaderData, ContractItemData} from './contract-data.model';
import {Contract} from './contract';
import {ContractItem} from './contract-item';
import {ContractItemFactory} from './contract-item-factory';
import {ContractsEntity} from './contracts-entity';

export class ContractFactory {

    static fromData(data: ContractData): Contract {
        if (!data) {
            throw new Error('invalid input');
        }
        const header = ContractFactory.extractHeaderFromData(data);
        const items = data.items ? ContractFactory.itemsFromData(data.items) : [];
        return new Contract(header, items);
    }

    static fromEntity(entity: ContractsEntity): Contract[] {
        return Object.keys(entity).map(id => ContractFactory.fromData(entity[id]));
    }

    private static itemsFromData(items: ContractItemData[]): ContractItem[] {
        if (items.length) {
            return items
                .filter(item => !!item)
                .map(item => ContractItemFactory.fromData(item));
        } else {
            return [];
        }
    }

    private static extractHeaderFromData(data: ContractData): ContractHeaderData {
        const {items: removed1, ...header} = data;
        return Object.assign({}, Contract.defaultValues(), header) as ContractHeaderData;
    }
}
