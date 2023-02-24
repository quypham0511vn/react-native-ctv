import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import VersionCheck from 'react-native-version-check';
import RNExitApp from 'react-native-exit-app';
import remoteConfig from '@react-native-firebase/remote-config';

import ImgLogo from '@/assets/images/img_logo.svg';
import { isIOS } from '@/commons/Configs';
import ScreenNames from '@/commons/ScreenNames';
import { HeaderBar } from '@/components';
import PopupUpdateVersion from '@/components/PopupUpdateVersion';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import { AppStatusModel } from '@/models/app-status';
import { PopupActionTypes } from '@/models/typesPopup';
import Navigator from '@/routers/Navigator';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/ScreenUtils';
import Utils from '@/utils/Utils';
import PopupMaintain from '@/components/PopupMaintain';

const Splash = observer(() => {
    const { apiServices, appManager } = useAppStore();

    const popupAlert = useRef<PopupActionTypes>(null);
    const storeUrlRef = useRef<string>();
    const popupMaintainRef = useRef<PopupActionTypes>(null);

    const fetchRemoteConfig = useCallback(async () => {
        await remoteConfig().fetch(0);
        await remoteConfig().fetchAndActivate();

        const isMaintenance = remoteConfig().getValue(isIOS ? 'ios_isMaintenance' : 'android_isMaintenance');

        if (isMaintenance.asBoolean() === true) {
            popupMaintainRef.current?.show();
        } else {
            checkUpdateApp();
        }
    }, []);

    const nextScreen = useCallback(async () => {
        setTimeout(async () => {
            if (SessionManager.isSkipOnboarding) {
                Navigator.replaceScreen(ScreenNames.tabs);
            } else {
                Navigator.replaceScreen(ScreenNames.onboarding);
            }
        }, 1e3);
    }, []);

    const fetchData = useCallback(async () => {
        const res = await apiServices.common.getAppInReview();
        if (res.success) {
            const data = res.data as AppStatusModel;
            appManager.setAppInReview(isIOS ? data.apple : data.google);
        } else {
            appManager.setAppInReview(isIOS);
        }
        nextScreen();
    }, []);

    const checkUpdateApp = useCallback(async () => {
        VersionCheck.needUpdate({
            provider: isIOS ? 'appStore' : 'playStore',
            packageName: DeviceInfo.getBundleId(),
            currentVersion: DeviceInfo.getVersion(),
            country: 'vn'
        }).then(async (res: any) => {
            if (res && res.isNeeded) {
                storeUrlRef.current = res.storeUrl;
                popupAlert.current?.show();
            } else {
                fetchData();
            }
        });
    }, [fetchData]);

    useEffect(() => {
        fetchRemoteConfig();
    }, []);

    const onUpdate = useCallback(() => {
        if(storeUrlRef.current){
            Utils.openURL(storeUrlRef.current);
        }else{
            onSkip();
        }
    }, []);

    const onSkip = useCallback(() => {
        nextScreen();
    }, []);

    const popupVerifyRequest = useMemo(() => (
        <PopupUpdateVersion
            onConfirm={onUpdate}
            onClose={onSkip}
            ref={popupAlert}
        />
    ), [onSkip, onUpdate]);

    const onQuit = useCallback(() => {
        popupMaintainRef?.current?.hide();
        RNExitApp.exitApp();
    }, []);

    return (
        <View style={styles.container}>
            <HeaderBar
                noHeader
                barStyle />

            <ImgLogo
                style={styles.imgLogo}
            />

            {popupVerifyRequest}
            <PopupMaintain
                onConfirm={onQuit}
                onClose={onQuit}
                ref={popupMaintainRef}
            />
        </View>
    );
});

export default Splash;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    imgLogo: {
        width: SCREEN_WIDTH - 100,
        alignSelf: 'center',
        marginBottom: SCREEN_HEIGHT / 5
    }
});
