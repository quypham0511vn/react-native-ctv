import { action, makeObservable, observable } from 'mobx';


export class NotificationManager {
  @observable unReadNotifyCount = 0;
  

  constructor() {
      makeObservable(this);
  }

  @action setUnReadNotifyCount(fastAuth: number) {
      this.unReadNotifyCount = fastAuth;
  }

  
}
