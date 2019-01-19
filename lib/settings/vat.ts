import {VatData} from './vat-data.model';
import {SettingData} from './setting-data.model';
import {DateTime} from 'luxon';
import {DateUtility} from '../utils';

export class Vat {

    static findVatPercentage(vatSettings: SettingData, taxCode: string, issuedAt: Date): number {

        return vatSettings.values
            .filter((vatSetting: VatData) => Vat.isValid(vatSetting, issuedAt))
            .sort((a: VatData, b: VatData) => a.validTo.getTime() - b.validTo.getTime())
            .first()
            .map((vatSetting: VatData) => vatSetting.percentage);
    }

    private static isValid(vatSetting: VatData, issuedAt: Date): boolean {
        const validity = DateUtility.getIntervalFromDates(vatSetting.validFrom, vatSetting.validTo);
        return validity.contains(DateTime.fromJSDate(issuedAt));
    }
}
