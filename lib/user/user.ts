import {UserData} from './user-data.model';

export class User {

    static defaultValues(): any {
        return {
            isLocked: false,
            roles: []
        };
    }

    private _data: UserData;
    constructor(data: UserData) {
        const defaultValues = User.defaultValues();
        this._data = { ...data };
        if (this._data.isLocked === undefined) this._data.isLocked = defaultValues.isLocked;
        if (!this._data.roles) this._data.roles = defaultValues.roles;
    }

    get uid(): string  | undefined {
        return this._data.uid;
    }
    get email(): string {
        return this._data.email || '';
    }
    set email(value: string) {
        this._data.email = value;
    }
    get roles(): string[] {
        return this._data.roles || [];
    }
    set roles(value: string[]) {
        this._data.roles = value;
    }
    get organization(): string {
        return this._data.organization || '';
    }
    set organization(value: string) {
        this._data.organization = value;
    }
    get displayName(): string {
        return this._data.displayName || '';
    }
    set displayName(value: string) {
        this._data.displayName = value;
    }
    get phoneNumber(): string {
        return this._data.phoneNumber || '';
    }
    set phoneNumber(value: string) {
        this._data.phoneNumber = value;
    }
    get imageUrl(): string {
        return this._data.imageUrl || '';
    }
    set imageUrl(value: string) {
        this._data.imageUrl = value;
    }
    get isLocked(): boolean {
        return this._data.isLocked || false;
    }
    set isLocked(value: boolean) {
        this._data.isLocked = value;
    }
    get data(): UserData {
        return this._data;
    }
    set data(data: UserData) {
        this._data ={...data };
    }
}
