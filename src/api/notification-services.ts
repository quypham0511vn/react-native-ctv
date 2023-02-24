import { BaseService } from './base-service';
import { API_CONFIG } from './constants';

export class NotificationServices extends BaseService {
    getNotifications = async (lastIndex: number, pageSize: number) =>
        this.api().post(
            API_CONFIG.NOTIFICATION,
            this.buildFormData({
                uriSegment: lastIndex,
                per_page: pageSize
            })
        );

    createFcmToken = async (fcmToken: string) =>
        this.api().post(
            API_CONFIG.CREATE_FCM_TOKEN,
            this.buildFormData({
                device_token: fcmToken
            })
        );

    getUnreadNotify = async () =>
        this.api().post(
            API_CONFIG.GET_UNREAD_COUNT_NOTIFICATION,
            this.buildFormData({})
        );
}
