import { action, makeObservable, observable } from 'mobx';

export class AppManager {
    @observable isAppInReview = false;

    constructor() {
        makeObservable(this);
    }

    @action setAppInReview(isAppInReview: boolean) {
        this.isAppInReview = isAppInReview;
    }
}
