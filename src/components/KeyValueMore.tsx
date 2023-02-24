import React from 'react';
import {
    StyleSheet, Text, View
} from 'react-native';

import IcArrow from '@/assets/images/ic_arrow_right.svg';
import { COLORS, Styles } from '@/theme';
import { Touchable } from '.';

const KeyValueMore = ({ label, value, leftIcon, onPress }:
    { label: string, value?: string, leftIcon?: any, onPress?: () => any }) => (
    <Touchable style={styles.root}
        onPress={onPress}>
        {leftIcon && <View style={styles.icon}>
            {leftIcon}
        </View>}
        <View style={styles.content}>
            <Text style={styles.key}>
                {label}
            </Text>
            {value && <Text style={styles.value}>
                {value}
            </Text>}
        </View>
        <IcArrow style={styles.icon} height={11} />
    </Touchable>
);

export default KeyValueMore;

const styles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: COLORS.GRAY_2,
        borderBottomWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 7
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    key: {
        ...Styles.typography.regular
    },
    value: {
        ...Styles.typography.medium
    },
    icon: {
        marginHorizontal: 5
    }
});
