import {ContractItemData} from './contract-data.model';
import {ContractItem} from './contract-item';

export class ContractItemFactory {

    static fromData(data: ContractItemData): ContractItem {
        return new ContractItem(data);
    }

    static fromDataArray(items: ContractItemData[]): ContractItem[] {
        if (!items.length) return [];
        return items
            .filter(item => !!item)
            .map(item => ContractItemFactory.fromData(item));
    }
}
