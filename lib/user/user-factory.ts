import {UserData} from './user-data.model';
import {User} from './user';
import {UsersEntity} from './users-entity';

export class UserFactory {

    static fromData(data: UserData): User {
        if (!data) {
            throw new Error('invalid input');
        }
        return new User(data);
    }

    static fromEntity(entity: UsersEntity): User[] {
        return Object.keys(entity).map(id => UserFactory.fromData(entity[id]));
    }


}
