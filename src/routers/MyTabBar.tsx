import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { ICONS } from '@/assets/icons/constant';
import { IconTienngay } from '@/assets/icons/icon-tienngay';
import { Configs, PADDING_BOTTOM, TAB_BAR_HEIGHT } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames, { TabNames } from '@/commons/ScreenNames';
import { Touchable } from '@/components';
import { COLORS, Styles } from '@/theme';
import SessionManager from '@/managers/SessionManager';

const TabsData = [
    {
        name: TabNames.homeTab,
        label: Languages.tabs.home,
        icon: ICONS.HOME,
        size: Configs.IconSize.size24,
        color: COLORS.GREEN
    },
    {
        name: TabNames.billingTab,
        label: Languages.tabs.billing,
        icon: ICONS.CLOCK,
        size: Configs.IconSize.size26,
        color: COLORS.GREEN
    },
    {
        name: TabNames.loanTab,
        label: Languages.tabs.loan,
        icon: ICONS.CLOCK,
        size: Configs.IconSize.size26,
        color: COLORS.GREEN
    },
    {
        name: TabNames.historyTab,
        label: Languages.tabs.transaction,
        icon: ICONS.CARD,
        size: Configs.IconSize.size26,
        color: COLORS.GREEN
    },
    {
        name: TabNames.accountTab,
        label: Languages.tabs.account,
        icon: ICONS.PROFILE,
        size: Configs.IconSize.size24,
        color: COLORS.GREEN
    }
];

export const MyTabBar = ({ state, navigation, descriptors, authTabIndexes }: any) => {
    const focusedOptions = descriptors[state.routes[state.index].key].options;

    return <View style={focusedOptions.tabBarVisible ? styles.tabContainer : styles.tabNoneContainer}>
        {state.routes.map((route: { name: string; key: any; }, index: any) => {
            const tab = TabsData.filter((item) => item.name === route.name)[0];

            const isFocused = state.index === index;
            const needAuthenticate = authTabIndexes.includes(index);
            // console.log('need',needAuthenticate);

            const onPress = useCallback(() => {
                const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key
                });
                if (!isFocused && !event.defaultPrevented) {
                    if (needAuthenticate) {
                        SessionManager.lastTabIndexBeforeOpenAuthTab = index;
                        navigation.navigate(ScreenNames.auth);
                    } else {
                        navigation.navigate(route.name);
                    }
                }
            }, [index, isFocused, needAuthenticate, route.key, route.name]);

            const color = isFocused ? tab.color : COLORS.GRAY_2;

            return (
                focusedOptions.tabBarVisible ? <Touchable
                    onPress={onPress}
                    style={styles.tab}
                    key={route.key}
                >
                    <>
                        <IconTienngay
                            name={tab.icon}
                            color={color}
                            size={tab.size}
                        />
                        {/* <Text style={[styles.tabLabel, color]}>{tab.label}</Text> */}
                    </>
                </Touchable> : null
            );
        })}
    </View>;
};

const styles = StyleSheet.create({
    tabContainer: {
        ...Styles.heavyShadow,
        flexDirection: 'row',
        paddingBottom: PADDING_BOTTOM,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        position: 'absolute',
        bottom: 0
    },
    tabNoneContainer: {
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: TAB_BAR_HEIGHT
    }
});
