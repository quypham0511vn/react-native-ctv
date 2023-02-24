import { action, makeObservable, observable } from 'mobx';

import { UserInfoModel } from '@/models/user-model';
import SessionManager from './SessionManager';

export class UserManager {
   
    @observable userInfo?: UserInfoModel = SessionManager.userInfo;

    @observable phoneNumber?: string = SessionManager.userInfo?.phone_number;

    constructor() {
        makeObservable(this);
    }

    @action updateUserInfo(userInfo?: UserInfoModel) {
        this.userInfo = userInfo;
        this.phoneNumber = userInfo?.phone_number;

        SessionManager.setUserInfo(userInfo);
    }
}
