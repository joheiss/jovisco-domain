import {RevenueData} from './revenue-data.model';
import {Revenue} from './revenue';

export class RevenueFactory {

    static fromData(data: RevenueData): Revenue {
        return new Revenue(data);
    }

    static fromDataArray(revenues: RevenueData []): Revenue[] {
        return revenues.map(r => RevenueFactory.fromData(r));
    }
}
