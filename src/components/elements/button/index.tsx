import React, { useCallback, useMemo } from 'react';
import { TextStyle, Text, View } from 'react-native';

import { Configs } from '@/commons/Configs';
import { COLORS } from '@/theme';
import { Touchable } from '../touchable';
import { BUTTON_STYLES } from './constants';
import { useStyleButton } from './styles';
import { ButtonProps } from './types';
import MyLoading from '@/components/MyLoading';

export const Button = ({
    label,
    style,
    buttonStyle,
    fontSize = Configs.FontSize.size14,
    isLoading,
    onPress,
    disabled,
    textColor,
    isLowerCase,
    leftIcon,
    rightIcon,
    tag,
    radius,
    textStyle,
    buttonContainer,
    value,
    textStyleValue,
    loading
}: ButtonProps) => {
    const styles = useStyleButton();

    const getContainerStyle = useMemo(() => {
        if (disabled) {
            return [
                loading ? styles.containerLoading : styles.container,
                styles.grayButton,
                style
            ];
        }
        let containerStyle = {};
        switch (buttonStyle) {
            case BUTTON_STYLES.GREEN:
                containerStyle = styles.greenButton;
                break;
            case BUTTON_STYLES.GRAY:
                containerStyle = styles.grayButton;
                break;
            case BUTTON_STYLES.LIGHT_GREEN:
                containerStyle = styles.lightGreenButton;
                break;
            default:
                containerStyle = styles.grayButton;
                break;
        }

        return [
            loading ? styles.containerLoading : styles.container,
            containerStyle,
            style,
            buttonContainer
        ];
    }, [disabled, buttonStyle, styles.container, styles.containerLoading, styles.grayButton, styles.greenButton, styles.lightGreenButton, style, buttonContainer, loading]);

    const getTextColor = useMemo(() => {
        if (disabled) {
            return COLORS.LIGHT_GRAY;
        }

        let color;
        switch (buttonStyle) {
            case BUTTON_STYLES.GREEN:
                color = COLORS.WHITE;
                break;
            case BUTTON_STYLES.GRAY:
                color = COLORS.GRAY_13;
                break;
            case BUTTON_STYLES.LIGHT_GREEN:
                color = COLORS.GREEN_2;
                break;
            default:
                color = COLORS.GRAY_13;
                break;
        }
        return textColor || color;
    }, [buttonStyle, disabled, textColor]);

    const getTextStyle = useMemo<TextStyle[]>(() => {
        const color = getTextColor;
        return [styles.text, { color, fontSize }];
    }, [fontSize, getTextColor, styles.text]);

    const _onPress = useCallback(() => {
        onPress?.(tag || label);
    }, [label, onPress, tag]);

    return (
        <Touchable
            disabled={isLoading || disabled}
            style={getContainerStyle}
            radius={radius || styles.container?.borderRadius}
            onPress={_onPress}>
            {leftIcon}

            <View style={styles.txtView}>
                {value &&
                    <Text style={textStyleValue || getTextStyle}>
                        {isLowerCase ? value : `${value}`.toUpperCase()}
                    </Text>}
                {loading ? <MyLoading isWhite /> :
                    <Text style={textStyle || getTextStyle}>
                        {isLowerCase ? label : `${label}`.toUpperCase()}
                    </Text>}
                {rightIcon}
            </View>
        </Touchable>
    );
};
