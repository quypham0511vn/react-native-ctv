import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Keyboard,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';

import { COLORS, Styles } from '@/theme';
import Utils from '@/utils/Utils';
import Validate from '@/utils/Validate';
import ICUnderArrow from '@/assets/images/ic_black_arrow_bottom.svg';
import { Touchable } from './elements/touchable';
import { PopupActionTypes } from '@/models/typesPopup';
import BottomSheetComponent from './BottomSheet';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';

export type ItemPickerProps = {
    value?: string;
    text?: string;
    id?: string | number | undefined;
};

type PickerProps = {
    leftIconPicker?: any,
    containerStyle?: ViewStyle;
    label?: string;
    placeholder?: string;
    placeholderSearch?: string;
    onPressItem?: (item: any) => void;
    value?: string;
    data?: Array<ItemPickerProps>;
    labelStyle?: ViewStyle;
    pickerStyle?: ViewStyle;
    rightIcon?: any;
    disable?: boolean;
    hideInput?: boolean;
    hasUnderline?: boolean;
    styleText?: TextStyle;
    isIcon?: boolean;
    btnContainer?: any,
    hasDash?: boolean,
    hasStar?: boolean,
    stylePlaceholder?: TextStyle,
    wrapErrText?: ViewStyle,
};
const PickerBottomBase = forwardRef<PopupActionTypes, PickerProps>(({
    label,
    placeholder,
    placeholderSearch,
    onPressItem,
    value,
    data,
    labelStyle,
    pickerStyle,
    rightIcon,
    disable,
    containerStyle,
    hasUnderline,
    styleText,
    stylePlaceholder,
    btnContainer,
    hasDash,
    leftIconPicker,
    wrapErrText,
    hasStar
}: PickerProps, ref: any) => {
    useImperativeHandle(ref, () => ({
        setErrorMsg
    }));
    const bottomSheetRef = useRef<PopupActionTypes>(null);

    const [errMsg, setErrMsg] = useState<string>('');
    const [animation] = useState(new Animated.Value(0));
    const [isFocusing, setFocus] = useState<boolean>(false);

    const openPopup = useCallback(() => {
        bottomSheetRef.current?.show();
        Keyboard.dismiss();
    }, []);

    const renderValue = useMemo(() => {
        if (value) {
            setErrMsg('');
            return <Text style={styleText}>{value}</Text>;
        }
        return (
            <Text style={[styles.placeholder, stylePlaceholder]}>
                {placeholder}
            </Text>
        );
    }, [placeholder, stylePlaceholder, styleText, value]);

    const _containerStyle = useMemo(() => {
        const style = {
            backgroundColor: !disable ? COLORS.WHITE : COLORS.GRAY_2
        } as ViewStyle;
        return [styles.wrapInput, pickerStyle, style];
    }, [disable, pickerStyle]);

    const startShake = useCallback(() => {
        Animated.sequence([
            Animated.timing(animation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(animation, { toValue: 0, duration: 50, useNativeDriver: true })
        ]).start();
    }, [animation]);

    // generate error message
    const errorMessage = useMemo(() => {
        const paddingText = { paddingBottom: 5 };
        if (!Validate.isStringEmpty(errMsg)) {
            return <View style={[paddingText, wrapErrText]}>
                <Text
                    style={styles.errorMessage}>{errMsg}</Text>
            </View>;
        }
        return null;
    }, [errMsg, wrapErrText]);

    const setErrorMsg = useCallback((msg: string) => {
        if (Validate.isStringEmpty(msg)) {
            setErrMsg('');
        } else {
            setErrMsg(msg);
            startShake();
        }
    }, [startShake]);

    const containerStyles = useMemo(() => {
        const style = {
            borderColor: isFocusing ? COLORS.RED : COLORS.GRAY_16,
            borderWith: 1
        };

        if (errMsg !== '') {
            style.borderColor = COLORS.RED;
        }

        return [hasUnderline ? styles.containerUnderLine : styles.container, style, { transform: [{ translateX: animation }] }];

    }, [animation, errMsg, hasUnderline, isFocusing]);

    const onChangeValue = useCallback((item: any) => {
        setErrMsg('');
        onPressItem?.(item);
    }, [onPressItem]);

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={[styles.wrapLabel, labelStyle]}>
                {
                    label && <><Text style={styles.label}>
                        {Utils.capitalizeFirstLetter(label || '')}
                    </Text>
                    {hasStar && <Text style={styles.red}>{Languages.common.star}</Text>}</>
                }
            </View>
            <Animated.View ref={ref} >
                <Touchable
                    onPress={openPopup}
                    style={[_containerStyle, containerStyles, btnContainer]}
                    disabled={disable}
                    radius={60}
                >
                    {leftIconPicker && (
                        leftIconPicker
                    )}
                    {renderValue}
                    <ICUnderArrow />
                </Touchable>
                <BottomSheetComponent
                    ref={bottomSheetRef}
                    data={data}
                    onPressItem={onChangeValue}
                    hasDash={hasDash}
                    rightIcon={rightIcon}
                    placeholderSearch={placeholderSearch}
                />
            </Animated.View>
            {errorMessage}
        </View>
    );
});

export default PickerBottomBase;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    wrapInput: {
        width: '100%',
        borderColor: COLORS.GRAY_16,
        borderWidth: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    wrapLabel: {
        flexDirection: 'row'
    },
    label: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_17,
        marginBottom: 8
    },
    red: {
        ...Styles.typography.regular,
        color: COLORS.RED_2,
        paddingLeft: 2
    },
    placeholder: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        paddingVertical: 1
    },
    leftIcon: {
        ...Styles.typography.regular,
        fontSize: Configs.IconSize.size18,
        color: COLORS.LIGHT_GRAY,
        marginRight: 10
    },
    errorMessage: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.RED
    },
    containerUnderLine: {
        justifyContent: 'center',
        paddingVertical: 0,
        height: Configs.FontSize.size40,
        borderBottomColor: COLORS.GRAY_7,
        borderBottomWidth: 1
    }
});
