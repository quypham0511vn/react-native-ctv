import React from 'react';
import {
    StyleSheet, Text, View
} from 'react-native';
import Dash from 'react-native-dash';

import { COLORS, Styles } from '@/theme';
import { Configs } from '@/commons/Configs';

const KeyValue = ({ label, value, noIndicator, color, styleKeyColor}:
    { label: string, value?: string, noIndicator?: boolean, color?: string, styleKeyColor?: any}) => (
    <View>
        <View style={styles.content}>
            <Text style={[styles.key, styleKeyColor]}>
                {label}
            </Text>
            <Text style={[styles.value, { color: color || styles.value.color }]}>
                {value}
            </Text>
        </View>
        {!noIndicator && <Dash
            dashThickness={1}
            dashLength={8}
            dashColor={COLORS.GRAY_2} 
            dashGap ={4} />}
    </View>
);

export default KeyValue;

const styles = StyleSheet.create({
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    key: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size13
    },
    value: {
        ...Styles.typography.medium,
        marginLeft: 10,
        flex: 1,
        textAlign: 'right'
    }
});
