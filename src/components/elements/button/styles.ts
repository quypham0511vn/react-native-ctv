import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Configs } from '@/commons/Configs';
import { COLORS, Styles } from '@/theme';

export const useStyleButton = () => useMemo(
    () =>
        StyleSheet.create({
            // default
            container: {
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                paddingVertical: 12,
                borderRadius: 40,
                width: '100%'
            },
            containerLoading: {
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                paddingVertical: 4,
                borderRadius: 40,
                width: '100%'
            },
            icon: {
                width: Configs.IconSize.size14,
                height: Configs.IconSize.size14,
                marginRight: 5
            },
            rightIcon: {
                paddingLeft: 10
            },
            lefIconFont: {
                paddingRight: 20,
                fontSize: Configs.IconSize.size30
            },
            text: {
                ...Styles.typography.medium,
                textAlign: 'center',
                width: '100%',
                color: COLORS.WHITE
            },
            greenButton: {
                backgroundColor: COLORS.GREEN
            },
            grayButton: {
                backgroundColor: COLORS.GRAY_18
            },
            lightGreenButton: {
                backgroundColor: COLORS.GREEN_4
            },
            txtView: {
                flexDirection: 'column'
            }
        }),
    []
);
