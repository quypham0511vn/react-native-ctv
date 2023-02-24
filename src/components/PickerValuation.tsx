import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TextStyle, View,
    ViewStyle
} from 'react-native';

import { IconTienngay } from '@/assets/icons/icon-tienngay';
import SelectIcon from '@/assets/images/ic_retangle.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { PopupActionTypes } from '@/models/typesPopup';
import { COLORS, CommonStyle, Styles } from '@/theme';
import Utils from '@/utils/Utils';
import Validate from '@/utils/Validate';
import { Touchable } from '.';
import BottomSheetComponent, { ItemProps } from './BottomSheet';

export type PickerAction = {
    setErrorMsg: (msg?: string) => void;
};

type PickerProps = {
    leftIcon?: string,
    containerStyle?: ViewStyle;
    label?: string;
    placeholder?: string;
    onPressItem?: (item: any) => void;
    value?: any;
    data?: Array<ItemProps>;
    labelStyle?: ViewStyle;
    pickerStyle?: ViewStyle;
    rightIcon?: string;
    disable?: boolean;
    isCheckboxList?: boolean,
    optional?: boolean,
    index?: number,
    onScrollTo?: (value: number) => void,
    placeholderStyle?: TextStyle
};

export const PickerValuation = forwardRef<PickerAction, PickerProps>(
    (
        {
            leftIcon,
            label,
            onPressItem,
            value,
            data,
            labelStyle,
            pickerStyle,
            containerStyle,
            isCheckboxList,
            optional = false,
            onScrollTo,
            placeholderStyle
        }: PickerProps,
        ref?: any
    ) => {

        useImperativeHandle(ref, () => ({
            setErrorMsg
        }));

        const bottomSheetRef = useRef<PopupActionTypes>(null);
        const [errMsg, setErrMsg] = useState<string>('');
        const [coordinate, setCoordinate] = useState<number>(0);

        const onChangeValue = useCallback((item: any) => {
            setErrMsg('');
            onPressItem?.(item);
        }, [onPressItem]);

        const openPopup = useCallback(() => {
            bottomSheetRef.current?.show();
        }, []);

        useImperativeHandle(ref, () => ({
            setErrorMsg
        }));
        const setErrorMsg = useCallback((msg: string) => {
            if (Validate.isStringEmpty(msg)) {
                return;
            }
            setErrMsg(msg);
            if ((data?.length || 0) > 0) {
                onScrollTo?.(coordinate);
            }
        }, [coordinate, data?.length, onScrollTo]);

        const renderValue = useMemo(() => {
            if (value) {
                return <Text numberOfLines={1} style={styles.textValue}>{value}</Text>;
            }
            return (
                <Text style={[styles.placeholder, placeholderStyle]}>
                    {Utils.capitalizeFirstLetter(label || '')}
                </Text>
            );
        }, [label, placeholderStyle, value]);

        const _containerStyle = useMemo(() => {
            const style = {
                backgroundColor: data?.length === 0 ? COLORS.GRAY_10 : COLORS.WHITE
            };
            return [styles.wrapInput, pickerStyle, style];
        }, [data?.length, pickerStyle]);

        const errorMessage = useMemo(() => {
            const paddingText = { paddingBottom: 0 };
            if (data?.length === 0) {
                setErrMsg('');
                return null;
            }
            if (!Validate.isStringEmpty(errMsg)) {
                return <View style={paddingText}>
                    <Text
                        style={styles.errorMessage}>{Utils.capitalizeFirstLetter(errMsg)} {Languages.loan.needToSelect} !</Text>
                </View>;
            }
            return null;
        }, [data?.length, errMsg]);

        const onLayout = useCallback((event: any) => {
            const layout = event.nativeEvent.layout;
            setCoordinate(layout.y);
        }, []);


        return (
            <View onLayout={onLayout} style={[styles.container, containerStyle]}>
                <View style={styles.wrapLabel}>
                    <Text style={[styles.label, labelStyle]}>
                        {Utils.capitalizeFirstLetter(label || '')}
                    </Text>
                    {!optional && <Text style={styles.red}> *</Text>}
                </View>
                <Touchable
                    onPress={openPopup}
                    style={_containerStyle}
                    disabled={data?.length === 0}
                    radius={CommonStyle.borderRadiusSingleLineInput}
                >
                    {leftIcon && (
                        <IconTienngay name={leftIcon} style={styles.leftIcon} />
                    )}
                    {renderValue}
                    <View style={styles.rightIcon}>
                        <SelectIcon />
                    </View>
                </Touchable>
                {errorMessage}
                <BottomSheetComponent
                    ref={bottomSheetRef}
                    data={data}
                    onPressItem={onChangeValue}
                    isCheckboxList={isCheckboxList}
                />
            </View>
        );
    });

export default PickerValuation;

const styles = StyleSheet.create({
    container: {
        marginTop: 15
    },
    wrapInput: {
        width: '100%',
        borderColor: COLORS.GRAY_2,
        borderWidth: 1,
        paddingHorizontal: 15,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: 40
    },
    wrapLabel: {
        flexDirection: 'row'
    },
    label: {
        ...Styles.typography.regular,
        marginBottom: 5
    },
    red: {
        ...Styles.typography.medium,
        color: COLORS.RED
    },
    placeholder: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_4
    },
    textValue: {
        ...Styles.typography.regular,
        color: COLORS.BLACK
    },
    leftIcon: {
        fontSize: Configs.IconSize.size18,
        color: COLORS.LIGHT_GRAY,
        marginRight: 10
    },
    rightIcon: {
        marginRight: 10,
        position: 'absolute',
        right: 0
        // top: 18
    },
    errorMessage: {
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.RED,
        marginLeft: 17,
        marginTop: 2
    }
});
