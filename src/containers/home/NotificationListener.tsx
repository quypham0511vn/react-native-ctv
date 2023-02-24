import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

import Utils from '@/utils/Utils';
import { isIOS } from '@/commons/Configs';
import Navigator from '@/routers/Navigator';
import { useAppStore } from '@/hooks';
import ScreenNames from '@/commons/ScreenNames';
import SessionManager from '@/managers/SessionManager';
import { NotificationTotalModel } from '@/models/notification';

const NotificationListener = observer(({ children }: any) => {
    const { apiServices, notificationManager, userManager } =
        useAppStore();
    const onLocalNotificationIOS = (notification: any) => {
        console.log('notification ===', notification);
        const isClicked = notification.getData().userInteraction === 1;
        if (isClicked) {
            navigateNotify();
        }
    };
    const navigateNotify = useCallback(() => {
        if (userManager?.userInfo) {
            setTimeout(() => {
                Navigator.navigateScreen(ScreenNames.notify);
            }, 200);
        } else {
            Navigator.navigateToDeepScreen([ScreenNames.auth], ScreenNames.login);
        }
    }, [userManager?.userInfo]);

    const createToken = useCallback(async () => {
        const fcmToken = await Utils.getFcmToken();
        if (fcmToken && SessionManager.accessToken) {
            console.log('fcmToken ===', fcmToken);

            apiServices?.notification?.createFcmToken(fcmToken);
        }
    }, [apiServices?.notification]);

    const getUnreadNotify = useCallback(async () => {
        // if (userManager.userInfo) {
        //     const res = await apiServices.notification?.getUnreadNotify();
        //     if (res.success) {
        //         const data = res.data as NotificationTotalModel;
        //         console.log('unred account ===', data?.total_unRead);
        //         notificationManager.setUnReadNotifyCount(data?.total_unRead);
        //         PushNotificationIOS.setApplicationIconBadgeNumber(data?.total_unRead);
        //     }
        // }
    }, []);

    const pushNotificationLocal = useCallback(async (remoteMessage: any) => {
        if (isIOS) {
            PushNotificationIOS.addNotificationRequest({
                id: 'notificationWithSound',
                title: remoteMessage?.notification?.title,
                body: remoteMessage?.notification?.body,
                sound: 'customSound.wav'
            });
        } else {
            PushNotification.localNotification({
                autoCancel: true,
                channelId: 'notify',
                showWhen: true,
                title: remoteMessage?.notification?.title,
                message: remoteMessage?.notification?.body,
                vibrate: true,
                vibration: 300,
                playSound: true,
                soundName: 'default',
                importance: 'high'
            });
        }
    }, []);

    useEffect(() => {
        createToken();
        getUnreadNotify();
        Utils.configNotification(navigateNotify);
        PushNotificationIOS.addEventListener(
            'localNotification',
            onLocalNotificationIOS
        );

        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            pushNotificationLocal(remoteMessage);
        });

        messaging().setBackgroundMessageHandler(async (remoteMessage) => { });

        messaging().onNotificationOpenedApp((remoteMessage) => {
            if (remoteMessage) {
                navigateNotify();
            }
        });

        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                if (remoteMessage) {
                    navigateNotify();
                }
            });
        return unsubscribe;
    }, []);
    return <>{children}</>;
});

export default NotificationListener;
