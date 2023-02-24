import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Configs } from '@/commons/Configs';
import { COLORS, CommonStyle, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/ScreenUtils';
import { SCREEN_HEIGHT } from '@/utils/DimensionUtils';

export const myTextFieldStyle = () => useMemo(
    () =>
        StyleSheet.create({
            container: {
                // flex:1,
                justifyContent: 'center',
                paddingHorizontal: 5,
                borderRadius: CommonStyle.borderRadiusSingleLineInput,
                paddingVertical: 0,
                height: Configs.FontSize.size40,
                borderColor: COLORS.LIGHT_GRAY,
                borderWidth: 1
            },
            containerMultiline: {
                justifyContent: 'center',
                paddingVertical: 10,
                borderRadius: CommonStyle.borderRadiusSingleLineInput,
                height: undefined
            },
            labelStyle: {
                color: COLORS.DARK_GRAY,
                fontSize: Configs.FontSize.size14,
                fontFamily: Configs.FontFamily.regular
            },
            inputStyle: {
                flex: 1,
                color:COLORS.BLACK
            },
            inputFont: {
                ...Styles.typography.regular,
                color: COLORS.DARK_GRAY,
                fontSize: Configs.FontSize.size14
            },
            showHidePassContainer: {
                position: 'absolute',
                right: 5,
                alignSelf: 'center',
                padding: 5
            },
            errorMessage: {
                fontSize: Configs.FontSize.size12,
                fontFamily: Configs.FontFamily.medium,
                color: COLORS.RED,
                marginLeft:10
            },
            flexRow: {
                flexDirection: 'row',
                paddingHorizontal: 10,
                alignItems:'center'
            },
            leftIconContainer: {
                width: 20,
                height: '100%',
                marginLeft: 10,
                justifyContent: 'center'
            },
            icRightOther: {
                width: Configs.IconSize.size16,
                height: Configs.IconSize.size16
            },
            leftIcon: {
                fontSize: Configs.IconSize.size14,
                color: COLORS.GRAY,
                marginRight: 10
            },
            rightIcon: {
                fontSize: Configs.IconSize.size14,
                color: COLORS.GRAY,
                marginLeft: 10
            },
            icPwd: {
                position: 'relative',
                right: 0,
                top: 0,
                zIndex: 9999,
                padding: 4
            },
            label: {
                ...Styles.typography.regular,
                marginBottom: 8
            },
            wrapLabel: {
                flexDirection: 'row'
            },
            red: {
                ...Styles.typography.medium,
                color: COLORS.RED_2
            },
            containerKeyBoard: {
                height: SCREEN_HEIGHT * 0.06,
                width: SCREEN_WIDTH,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row'
            },
            viewKeyBoard: {
                flex: 1,
                flexDirection: 'row',
                backgroundColor: COLORS.WHITE,
                height: SCREEN_HEIGHT * 0.06,
                padding: 5
            },
            viewIconKeyBoard: {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center'
            },
            viewPlaceHolder: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            },
            txtPlaceHolder: {
                ...Styles.typography.mediumSmall,
                color: COLORS.GRAY,
                fontSize: Configs.FontSize.size12
            },
            viewDone: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'flex-end'
            },
            tobKeyBoard: {
                width: SCREEN_WIDTH * 0.12,
                height: SCREEN_HEIGHT * 0.06,
                marginHorizontal: 7,
                justifyContent: 'center',
                alignItems: 'flex-end'
            },
            txtDone: {
                ...Styles.typography.medium,
                color: COLORS.BLACK,
                fontSize: Configs.FontSize.size14
            },
            tobIcon: {
                marginHorizontal: 2
            },
            viewIconRight: {
                padding: 5
            },
            styleIconRight: {
                width: 40,
                height: '100%',
                backgroundColor: COLORS.WHITE,
                justifyContent: 'center',
                alignItems: 'center'
            }
        })
    , []);
