import { LoanBillServices } from './loan-bill-service';
import { AuthServices } from './auth-services';
import { CommonServices } from './common-services';
import { HistoryServices } from './history-services';
import { ImageServices } from './image-services';
import { NotificationServices } from './notification-services';
import { GroupManagerServices } from './group-manager-services';

export class ApiServices {

    auth = new AuthServices();

    common = new CommonServices();

    history = new HistoryServices();

    notification = new NotificationServices();

    imageServices = new ImageServices();

    loanBillServices = new LoanBillServices();

    groupManagerServices = new GroupManagerServices();
}
