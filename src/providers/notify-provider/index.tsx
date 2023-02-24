import messaging from '@react-native-firebase/messaging';
import { observer, useLocalObservable } from 'mobx-react';
import React, { useCallback, useEffect } from 'react';
import PushNotification from 'react-native-push-notification';

import ScreenNames, { TabNames } from '@/commons/ScreenNames';
import Navigator from '@/routers/Navigator';
import { NotifyContext } from './context';

export const NotifyProvider = observer(({ children }: any) => {
    const storeLocal = useLocalObservable(() => ({}));

    useEffect(() => {
        requestUserPermission();
        createChannel();
        PushNotification.configure({
            // (required) Called when a remote is received or opened, or local notification is opened
            async onNotification (notification:any) {
                if (notification.channelId) {
                    console.log('forground',notification);
                    Navigator.navigateScreen(ScreenNames.notify);
                }
                // (required) Called when a remote is received or opened, or local notification is opened
            },
      
            // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
            onAction (notification:any) {
                console.log('ACTION:', notification.action);
                console.log('NOTIFICATION:', notification);
      
                // process the action
            },
      
            // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
            onRegistrationError (err:any) {
                console.error(err.message, err);
            },
      
            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },
      
            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,
      
            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */
            requestPermissions: true
        });
    
    }, []);

    const createChannel = () => {
        PushNotification.createChannel(
            {
                channelId: 'noti', // (required)
                channelName: 'My channel', // (required)
                channelDescription: 'A channel to categorise your notifications' // (optional) default: undefined.
            },
            (created:any) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
        );
    };
    
    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission({
            alert: false
        });
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    
        if (enabled) {
            console.log('Authorization status:', authStatus);
        }
    };

    useEffect(() => {
        // console.log('');
        getToken();
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            // console.log(" ====== onMessage", remoteMessage);
            // alert("d")
            console.log('onMessage',remoteMessage);
            PushNotification.localNotification({
                autoCancel: true,
                data: 'test',
                channelId: 'noti',
                // bigText:
                //   'This is local notification demo in React Native app. Only shown, when expanded.',
                // subText: 'Local Notification Demo',
                // title: 'Local Notification Title',
                showWhen: true,
                message: remoteMessage?.notification?.body,
                vibrate: true,
                vibration: 300,
                playSound: true,
                soundName: 'default',
                badge: 10
                // actions: '["Yes", "No"]'
            });
      
           
        });
        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
            console.log(remoteMessage);
        });
        messaging().onNotificationOpenedApp((remoteMessage) => {
            if (remoteMessage) {
                // Navigator.navigateScreen(ScreenNames.notify);
                setTimeout(() => {
                    Navigator.navigateToDeepScreen([ScreenNames.tabs,TabNames.homeTab], ScreenNames.notify);
                }, 1000);
            }
        });
        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
               
                if (remoteMessage) {
                    // Navigator.navigateScreen(ScreenNames.notify);
                    setTimeout(() => {
                        Navigator.navigateToDeepScreen([ScreenNames.tabs,TabNames.homeTab], ScreenNames.notify);
                    }, 1000);
                }
            });
        return unsubscribe;
    }, [storeLocal]);

    const getToken = useCallback(() => {
        messaging().getToken()
            .then(fcmToken => {
                if(fcmToken) {
                    console.log(fcmToken);
                } else {
                    console.log('[FCMService] User does not have a device token');
                } 
            }).catch(error => {
                console.log('[FCMService] getToken rejected', error);
            });
    },[]);

    return (<>
        <NotifyContext.Provider value={storeLocal}>
            {children}
        </NotifyContext.Provider>
    </>
    );
});
