import {ReportingHeaderData} from './reporting-data.model';

export interface RevenueData extends ReportingHeaderData {
    organization: string;
    months: { [month: string]: { [receiverId: string]: number } };
}
