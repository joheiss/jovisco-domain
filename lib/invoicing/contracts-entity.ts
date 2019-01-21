import {ContractData} from './contract-data.model';
import {Contract} from './contract';
import {Dictionary} from './dictionary';

// export type ContractsEntity = { [id: string]: ContractData };
export type ContractsEntity = Dictionary<ContractData>;

export function mapContractsEntityToObjArray(entity: ContractsEntity): Contract[] {
    return Object.keys(entity).map(id => Contract.createFromData(entity[id]));
}
