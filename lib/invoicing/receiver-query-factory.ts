import {ReceiverQuery} from './receiver-query';
import {Receiver} from './receiver';

export class ReceiverQueryFactory {

    static fromReceiver(receiver: Receiver): ReceiverQuery {
        return new ReceiverQuery(receiver);
    }

}
