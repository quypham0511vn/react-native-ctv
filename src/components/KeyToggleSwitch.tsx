import React from 'react';
import {
    StyleSheet, Text, TextStyle, View
} from 'react-native';
import { Switch } from 'react-native-switch';
import Dash from 'react-native-dash';

import { COLORS, Styles } from '@/theme';
import { Configs } from '@/commons/Configs';

const KeyToggleValue = ({ leftIcon, label, isEnabledSwitch, onToggleSwitch, hasDash, styleLabel }:
    { label: string, isEnabledSwitch: boolean, onToggleSwitch: (value: boolean) => any, hasDash?: boolean, leftIcon?: any, styleLabel?: TextStyle }) => (
    <View style={styles.container}>
        <View style={styles.fingerWrap}>
            {leftIcon &&
                <View style={styles.leftIconContainer}>
                    {leftIcon}
                </View>}

            <View style={styles.featureFingerContainer}>
                <Text style={styleLabel || styles.txtAuthnFinger}>{label}</Text>
                <Switch
                    value={isEnabledSwitch}
                    onValueChange={onToggleSwitch}
                    circleSize={Configs.FontSize.size22}
                    barHeight={Configs.FontSize.size22}
                    circleBorderWidth={1}
                    backgroundActive={COLORS.GREEN}
                    backgroundInactive={COLORS.BACKDROP}
                    circleActiveColor={COLORS.WHITE}
                    circleInActiveColor={COLORS.WHITE}
                    renderActiveText={false}
                    renderInActiveText={false}
                />
            </View>
        </View>
        {hasDash && <Dash
            dashThickness={1}
            dashLength={10}
            dashGap={4}
            dashColor={COLORS.GRAY_14}
            style={styles.dash}
        />}
    </View>
);

export default KeyToggleValue;

const styles = StyleSheet.create({
    txtAuthnFinger: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_7,
        paddingLeft: 14
    },
    container: {
        flex: 1
    },
    dash: {
        paddingVertical: 1
    },
    featureFingerContainer: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        flex: 1
    },
    fingerWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1
    },
    leftIconContainer: {
        flex: 0.1,
        alignItems: 'flex-start'
    }
});
