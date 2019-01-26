import {ContractItemData} from './contract-data.model';
import {ContractItem} from './contract-item';

export class ContractItemFactory {

    static fromData(data: ContractItemData): ContractItem {
        return new ContractItem(data);
    }

}
