import React, { useCallback, useMemo } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

import IcBack from '@/assets/images/ic_green_back.svg';
import { Configs, isIOS, PADDING_TOP, STATUSBAR_HEIGHT } from '@/commons/Configs';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/ScreenUtils';
import { Touchable } from '.';

const IMG_HEADER_HEIGHT = SCREEN_WIDTH / 375 * 85;

type HeaderProps={
    onGoBack?:()=>void,
    title?:string,
    hasBack?:boolean
}

export const HeaderLogin = ({
    onGoBack,
    hasBack,
    title
}: HeaderProps) => {

    const _onBackPressed = useCallback(() => {
        if (onGoBack) {
            onGoBack();
        }
        return false;
    }, [onGoBack]);

    const renderBack = useMemo(() => (
        <Touchable style={styles.wrapIcon} onPress={_onBackPressed}
            size={40}>
            <IcBack
                width={30}
                height={20} />
        </Touchable>
    ), [_onBackPressed]);

    const renderTitle = useMemo(() => (
        <View style={styles.titleContainer}>
            <Text
                numberOfLines={1}
                style={styles.titleCenter}>
                {title?.toLocaleUpperCase()}
            </Text>
        </View>
    ), [title]);

    return (
        <View style={styles.container}>
            {( isIOS) ? null
                : <StatusBar
                    translucent
                    backgroundColor={'transparent'}
                    barStyle={'light-content'} />}
            {<View style={styles.headerContainer}>
                {hasBack&&renderBack}
                {renderTitle}
            </View>}
        </View>
    );
};

export default HeaderLogin;

const styles = StyleSheet.create({
    container: {
        height: IMG_HEADER_HEIGHT
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginTop: STATUSBAR_HEIGHT + PADDING_TOP
    },
    titleContainer: {
        position: 'absolute',
        right: 50,
        left: 50,
        justifyContent: 'center',
        alignContent: 'center'
    },
    wrapIcon:{
        justifyContent: 'center',
        marginLeft:13
    },
    titleCenter: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        textAlign: 'center',
        color: COLORS.GREEN
    }
});
