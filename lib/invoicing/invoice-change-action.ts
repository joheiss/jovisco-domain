import {ItemChangeMode} from './item-change-mode';
import {Invoice} from './invoice';

export interface InvoiceChange {
  mode: ItemChangeMode;
  object: string;
  id?: string | number;
  field?: string;
  value?: any;
}

export const INVOICE_HEADER_ISSUED_AT_CHANGED = '[invoice change] header issuedAt changed';
export const INVOICE_HEADER_RECEIVER_ID_CHANGED = '[invoice change] header receiverId changed';
export const INVOICE_HEADER_CONTRACT_ID_CHANGED = '[invoice change] header contractId changed';
export const INVOICE_ITEM_CONTRACT_ITEM_ID_CHANGED = '[invoice change] item contractItemId changed';
export const INVOICE_ITEM_ID_ADDED = '[invoice change] item id added';

export class InvoiceChangeAction {

  static createFromData(change: InvoiceChange, invoice: Invoice): InvoiceChangeAction {
    const type = change.field ?
      `[invoice change] ${change.object} ${change.field} ${change.mode}` :
      `[invoice change] ${change.object} ${change.mode}`;

    return new InvoiceChangeAction(type, change, invoice);
  }
  private constructor(public type: string, public change: InvoiceChange, public payload: Invoice) {}
}

