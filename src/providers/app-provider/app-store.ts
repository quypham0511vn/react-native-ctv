import { makeObservable, observable } from 'mobx';

import { FastAuthInfo as FastAuthInfoManager } from '@/managers/FastAuthenInfo';
import { UserManager } from '@/managers/UserManager';
import { NetworkManager } from '@/managers/NetworkManager';
import { ApiServices } from '@/api';
import { NotificationManager } from '@/managers/NotificationManager';
import { AppManager } from '@/managers/AppManager';

class AppStore {
  @observable userManager = new UserManager();

  @observable networkManager = new NetworkManager();

  @observable fastAuthInfoManager = new FastAuthInfoManager();
  
  @observable notificationManager = new NotificationManager();
  
  @observable appManager = new AppManager();

  apiServices = new ApiServices();

  constructor() {
      makeObservable(this);
  }

}

export type AppStoreType = AppStore;
export default AppStore;
