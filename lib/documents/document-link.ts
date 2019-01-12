import {DocumentLinkData} from './document-link-data.model';
import {DocumentLinkType} from './document-link-type.model';
import {BusinessObject} from '../invoicing';

export class DocumentLink {

    public static createFromData(data: DocumentLinkData): DocumentLink {
        return new DocumentLink(data);
    }

    public static defaultValues(): DocumentLinkData {
        return {
            attachToEmail: false,
            type: DocumentLinkType.Other
        };
    }

    public static getOwnerFromBo(object: BusinessObject): string {
        return object.ownerKey;
    }

    private _data: DocumentLinkData;
    constructor(data: DocumentLinkData) {
        const defaultValues = DocumentLink.defaultValues();
        this._data = { ... data };
        if (this._data.attachToEmail === undefined) {
            this._data.attachToEmail = defaultValues.attachToEmail;
        }
        if (this._data.type === undefined) {
            this._data.type = defaultValues.type;
        }
    }

    get data(): DocumentLinkData {
        return this._data;
    }
    set data(data: DocumentLinkData) {
        this._data = { ...data };
    }

    get attachToEmail(): boolean {
        return this._data.attachToEmail;
    }
    set attachToEmail(value: boolean) {
        this._data.attachToEmail = value;
    }

    get name(): string | undefined {
        return this._data.name;
    }
    set name(value: string | undefined) {
        this._data.name = value;
    }

    get owner(): string | undefined {
        return this._data.owner;
    }
    set owner(value: string | undefined) {
        this._data.owner = value;
    }

    get path(): string | undefined {
        return this._data.path;
    }
    set path(value: string | undefined) {
        this._data.path = value;
    }

    get type(): DocumentLinkType {
        return this._data.type;
    }
    set type(value: DocumentLinkType) {
        this._data.type = value;
    }

    get objectType(): string | undefined {
        const split = this.owner ? this.owner.split('/') : [];
        if (split.length !== 2) {
            return undefined;
        }
        return split[0];
    }
}
