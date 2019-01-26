import {RevenueData} from './revenue-data.model';
import {RevenuePerYearData} from './revenue-per-year-data.model';
import {Revenue} from './revenue';

export class RevenueFactory {

    static fromData(data: RevenueData): Revenue {
        return new Revenue(data);
    }

}
