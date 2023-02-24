import React from 'react';
import {
    StyleSheet, Text, TextStyle, View
} from 'react-native';
import Dash from 'react-native-dash';

import { COLORS, Styles } from '@/theme';
import { Configs } from '@/commons/Configs';
import { TYPE_COLOR } from '@/commons/constants';

const KeyValueLoanList = ({ label, value, noIndicator, styleKeyColor, styleValueColor, colorValue }:
    { label: string, value?: string, noIndicator?: boolean, color?: string, styleKeyColor?: TextStyle, styleValueColor?: TextStyle, colorValue?: string }) => (
    <View>
        <View style={styles.content}>
            <Text style={[styles.key, styleKeyColor]}>{label} </Text>
            <Text style={[styles.value, styleValueColor, colorValue === TYPE_COLOR.GREEN && styles.styleValueGreenColor, colorValue === TYPE_COLOR.RED && styles.styleValueRedColor]}>{value}</Text>
        </View>
        {!noIndicator && <Dash
            dashThickness={1}
            dashLength={6}
            dashColor={COLORS.GRAY_15}
            dashGap={4} />}
    </View>
);

export default KeyValueLoanList;

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8
    },
    key: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size13,
        color: COLORS.GRAY_13,
        flex: 1
    },
    value: {
        ...Styles.typography.regular,
        marginLeft: 10,
        color: COLORS.GRAY_13,
        flex: 1.3
    },
    styleValueGreenColor: {
        ...Styles.typography.medium,
        color: COLORS.GREEN_2
    },
    styleValueRedColor: {
        ...Styles.typography.medium,
        color: COLORS.RED_2
    }
});
