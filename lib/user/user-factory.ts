import {UserData} from './user-data.model';
import {User} from './user';

export class UserFactory {

    static fromData(data: UserData): User {
        if (!data) {
            throw new Error('invalid input');
        }
        return new User(data);
    }

}
