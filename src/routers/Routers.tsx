import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import codePush from 'react-native-code-push';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ViewStyle } from 'react-native';

import { COLORS } from '@/theme';
import { navigationRef } from './Navigator';
import RootStack from './RootStack';
import { AppStoreProvider } from '@/providers/app-provider';
import { NetworkProvider } from '@/providers/network-provider';
import { PopupsProvider } from '@/providers/popups-provider';
import ToastUtils from '@/utils/ToastUtils';
import Languages from '@/commons/Languages';

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: COLORS.WHITE
    }
};

const styles = { flex: 1 } as ViewStyle;

const App = () => {
    codePush.sync(codePushOptions,
        (status) => {
            switch (status) {
                case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                    ToastUtils.showMsgToast(Languages.update.updating);
                    break;
                case codePush.SyncStatus.INSTALLING_UPDATE:
                    ToastUtils.showMsgToast(Languages.update.installing);
                    break;
                case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                    ToastUtils.showMsgToast(Languages.update.installing);
                    break;
                case codePush.SyncStatus.UP_TO_DATE:
                    break;
                case codePush.SyncStatus.UPDATE_INSTALLED:
                    ToastUtils.showMsgToast(Languages.update.installed);
                    break;
                default:
                    break;
            }
        }, () => { }
    );
    return (
        <AppStoreProvider>
            <NetworkProvider>
                <PopupsProvider>
                    <GestureHandlerRootView style={styles}>
                        <NavigationContainer ref={navigationRef} theme={MyTheme}>
                            <BottomSheetModalProvider>
                                <RootStack />
                            </BottomSheetModalProvider>
                        </NavigationContainer>
                    </GestureHandlerRootView>
                </PopupsProvider>
            </NetworkProvider>
        </AppStoreProvider>
    );
};

const codePushOptions = {
    installMode: codePush.InstallMode.IMMEDIATE,
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME
};
export default codePush(codePushOptions)(App);
