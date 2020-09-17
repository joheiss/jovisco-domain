import {User} from '../lib/user';
import {UserFactory} from '../lib/user/user-factory';

describe('user tests', () => {
    it('should create a user', () => {
        const user = mockUser();
        console.log('user: ', user);
        expect(user).toBeTruthy();
        expect(user.email).toEqual('tester.test@test.example.de');
        expect(user.uid).toBeTruthy();
    });
});

const mockUser = (): User => {
    const data = {
        email: 'tester.test@test.example.de',
        organization: 'GHQ',
        displayName: 'Tester Test',
        phoneNumber: '+49 777 7654321',
        uid: '0pOtTfuTelN0XmMMlE48OBAqzUG3'
    };

    return UserFactory.fromData(data);
};
