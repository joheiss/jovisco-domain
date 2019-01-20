import {ContractData} from './contract-data.model';
import {Contract} from './contract';

export type ContractsEntity = { [id: string]: ContractData };

export function mapContractsEntityToObjArray(entity: ContractsEntity): Contract[] {
    return Object.keys(entity).map(id => Contract.createFromData(entity[id]));
}
