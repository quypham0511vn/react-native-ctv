import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
} from 'react';
import { Animated, InputAccessoryView, Keyboard, Text, TextInput, TextStyle, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { IconTienngay } from '@/assets/icons/icon-tienngay';
import { Configs, isIOS } from '@/commons/Configs';
import { COLORS } from '@/theme';
import Validate from '@/utils/Validate';
import { Touchable } from '../touchable';
import { myTextFieldStyle } from './styles';
import { TextFieldActions, TextFieldProps, TypeKeyBoard } from './types';
import HidePwd from '@/assets/images/ic_hidepwd.svg';
import ShowPwd from '@/assets/images/ic_showpwd.svg';
import Utils from '@/utils/Utils';
import IcKeyBoardDown from '@/assets/images/ic_keyboard_arrow_down.svg';
import IcKeyBoardUp from '@/assets/images/ic_keyboard_arrow_up.svg';
import Languages from '@/commons/Languages';

export const MyTextInput = forwardRef<TextFieldActions, TextFieldProps>(
    (
        {
            keyboardType = 'DEFAULT',
            value,
            placeHolder,
            isPassword,
            disabled,
            inputStyle,
            inputStylePwDIcon,
            hideIconClear = false,
            onChangeText,
            onEndEditing,
            maxLength,
            multiline,
            leftIcon,
            onFocusCallback,
            containerInput,
            rightIcon,
            iconSize,
            testID,
            autoFocus,
            onKeyPress,
            placeHolderColor,
            defaultValue,
            labelStyle,
            optional,
            label,
            wrapErrText,
            customerRightIcon,
            autoCapitalized,
            stylesContainer,
            orderRef,
            refArr,
            textContentType,
            inputAccessoryViewID,
            onClickRightIcon
        }: TextFieldProps,
        ref?: any
    ) => {
        useImperativeHandle(ref, () => ({
            setValue,
            fillValue,
            getValue,
            focus,
            blur,
            setErrorMsg
        }));
        const [isShowPwd, setIsShowPwd] = useState<boolean>(false);
        const [isFocusing, setFocus] = useState<boolean>(false);
        const [textfieldVal, setTextfieldVal] = useState<string>(`${value || ''}`);
        const [errMsg, setErrMsg] = useState<string>('');
        const [animation] = useState(new Animated.Value(0));

        const styles = myTextFieldStyle();

        const orgTextInput = useRef<TextInput>(null);

        const defInputProps = {
            keyboardType:
                TypeKeyBoard[
                    keyboardType === 'NUMBER'
                        ? isIOS
                            ? keyboardType
                            : 'NUMERIC'
                        : keyboardType
                ],
            editable: !disabled
        };

        // useEffect(() => {
        //     if (onKeyPress) {
        //         onKeyPress(testID, testID);
        //     }
        // }, [onKeyPress, testID]);

        useEffect(() => {
            if (onChangeText) {
                onChangeText(textfieldVal, placeHolder || testID);
            }
        }, [onChangeText, placeHolder, testID, textfieldVal]);

        const getValue = useCallback(() => textfieldVal.trim(), [textfieldVal]);

        const setValue = useCallback(
            (text: any) => {
                if (maxLength) {
                    text = `${text}`.slice(0, maxLength);
                }
                setTextfieldVal(text);
                setErrMsg('');
            },
            [maxLength]
        );

        const fillValue = useCallback(
            (text: any) => {
                setValue(text);
            },
            [setValue]
        );

        useEffect(() => {
            if (!Validate.isEmpty(value)) {
                setValue(value);
            }
        }, [setValue, value]);

        const focus = useCallback(() => {
            if (orgTextInput.current) {
                orgTextInput.current?.focus();
            }
        }, []);

        const blur = useCallback(() => {
            if (orgTextInput.current) {
                orgTextInput.current?.blur();
            }
        }, []);

        const eventTextChange = useCallback(
            (text: string) => {
                if (text.slice(0, 3) !== '+84') {
                    setValue(text);
                }
            },
            [setValue]
        );

        const eventEndEditing = useCallback(() => {
            if (onEndEditing) {
                onEndEditing(`${textfieldVal}`, placeHolder);
            }
        }, [onEndEditing, placeHolder, textfieldVal]);

        const onFocus = useCallback(() => {
            onFocusCallback?.(placeHolder);
            setFocus(true);
        }, [onFocusCallback, placeHolder]);

        const onBlur = useCallback(() => {
            setFocus(false);
        }, []);

        const eventClearText = useCallback(() => {
            eventTextChange('');
        }, [eventTextChange]);

        const containerStyle = useMemo(() => {
            const borderStyle = {
                borderColor: isFocusing ? COLORS.GREEN : COLORS.GRAY_2
            };

            const style = {
                backgroundColor: disabled ? COLORS.GRAY_2 : COLORS.WHITE
            };

            const backgroundStyle = {
                backgroundColor: isFocusing ? COLORS.WHITE : COLORS.GRAY_2
            };

            if (errMsg !== '') {
                borderStyle.borderColor = COLORS.RED;
            }
            return [styles.container, borderStyle, backgroundStyle, style, containerInput, { transform: [{ translateX: animation }] }];
        }, [animation, containerInput, disabled, errMsg, isFocusing, styles.container]);

        const leftIconStyle = useMemo(() => {
            const style = {
                color: isFocusing ? COLORS.GREEN : COLORS.LIGHT_GRAY,
                fontSize: iconSize || styles.leftIcon.fontSize
            };
            return [styles.leftIcon, style];
        }, [iconSize, isFocusing, styles.leftIcon]);

        const rightIconStyle = useMemo(() => {
            const style = {
                color: isFocusing ? COLORS.GREEN : COLORS.LIGHT_GRAY,
                fontSize: iconSize || styles.rightIcon.fontSize
            };
            return [styles.rightIcon, style];
        }, [iconSize, isFocusing, styles.rightIcon]);

        const iconClearStyle = useMemo<TextStyle[]>(() => {
            let marginTop = 0;
            if (multiline) {
                marginTop = 7;
            }
            return [styles.showHidePassContainer, { marginTop }];
        }, [styles.showHidePassContainer, multiline]);

        const iconClearText = useMemo(() => {
            if (`${textfieldVal}`.length > 0 && !isPassword && !hideIconClear) {
                return (
                    <Touchable style={iconClearStyle} onPress={eventClearText}>
                        {/* <IconTienngay name={ICONS.WARNING} style={{
                        fontSize: Configs.IconSize.size16,
                        color: COLORS.DARK_GRAY
                    }} /> */}
                    </Touchable>
                );
            }
            return null;
        }, [textfieldVal, isPassword, hideIconClear, iconClearStyle, eventClearText]);

        const _inputStyle = useMemo(
            () => inputStyle || styles.inputFont,
            [styles.inputFont, inputStyle]
        );

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
            const paddingText = { paddingBottom: 0 };
            if (!Validate.isStringEmpty(errMsg)) {
                return <View style={[paddingText, wrapErrText]}>
                    <Text
                        style={styles.errorMessage}>{errMsg}</Text>
                </View>;
            }
            return null;
        }, [errMsg, styles.errorMessage, wrapErrText]);

        const setErrorMsg = useCallback((msg: string) => {
            if (Validate.isStringEmpty(msg)) {
                return;
            }
            setErrMsg(msg);
            startShake();
        }, [startShake]);

        const onPressPwd = useCallback(() => {
            setIsShowPwd(last => !last);
        }, []);

        const handleDown = useCallback(() => {
            if (orderRef !== refArr?.length) {
                refArr?.[orderRef || 0]?.current?.focus();
            }
        }, [orderRef, refArr]);

        const handleUp = useCallback(() => {
            if (orderRef !== 1 && orderRef) {
                refArr?.[orderRef - 2]?.current?.focus();
            }
        }, [orderRef, refArr]);

        const handleKey = useCallback(({ nativeEvent }: any) => {
            if (nativeEvent.key.toString().slice(0, 3) === '+84') {
                nativeEvent.key = `0${nativeEvent.key.toString().slice(3, nativeEvent.key.length)}`;
                setValue(nativeEvent.key);
            }
            onKeyPress?.(nativeEvent);
        }, [onKeyPress, setValue]);

        const renderHeaderKeyBroad = useMemo(() => (
            <InputAccessoryView nativeID={inputAccessoryViewID} style={styles.containerKeyBoard}>
                <View style={styles.viewKeyBoard}>
                    <View style={styles.viewIconKeyBoard}>
                        <TouchableOpacity onPress={handleDown} disabled={orderRef === (Number(refArr?.length) + 1)} style={styles.tobIcon}>
                            <IcKeyBoardDown width={Configs.FontSize.size28} height={Configs.FontSize.size28} stroke={orderRef === refArr?.length ? COLORS.GRAY_10 : COLORS.GRAY} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleUp} disabled={orderRef === 1} style={styles.tobIcon}>
                            <IcKeyBoardUp width={Configs.FontSize.size28} height={Configs.FontSize.size28} stroke={orderRef === 1 ? COLORS.GRAY_10 : COLORS.GRAY} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.viewPlaceHolder}>
                        <Text style={styles.txtPlaceHolder}>{placeHolder}</Text>
                    </View>
                    <View style={styles.viewDone}>
                        <TouchableOpacity
                            style={styles.tobKeyBoard}
                            onPress={() => Keyboard.dismiss()}
                        >
                            <Text style={styles.txtDone}>{Languages.authentication.done}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </InputAccessoryView>
        ), [handleDown, handleUp, inputAccessoryViewID, orderRef, placeHolder, refArr?.length, styles.containerKeyBoard, styles.tobIcon, styles.tobKeyBoard, styles.txtDone, styles.txtPlaceHolder, styles.viewDone, styles.viewIconKeyBoard, styles.viewKeyBoard, styles.viewPlaceHolder]);

        return (
            <View style={stylesContainer}>
                {label && <View style={styles.wrapLabel}>
                    <Text style={[styles.label, labelStyle]}>
                        {Utils.capitalizeFirstLetter(label || '')}
                    </Text>
                    {optional && <Text style={styles.red}> *</Text>}
                </View>}
                <Animated.View
                    style={containerStyle}
                    ref={ref}
                >
                    <View style={styles.flexRow}>
                        {leftIcon && <IconTienngay name={leftIcon} style={leftIconStyle} />}
                        <TextInput
                            ref={orgTextInput}
                            {...defInputProps}
                            style={[styles.inputStyle, _inputStyle]}
                            inputAccessoryViewID={inputAccessoryViewID}
                            placeholder={placeHolder}
                            placeholderTextColor={placeHolderColor || COLORS.GRAY_4}
                            selectionColor={COLORS.GRAY_4}
                            numberOfLines={1}
                            secureTextEntry={isShowPwd ? !isPassword : isPassword}
                            autoCorrect={false}
                            value={`${textfieldVal}`}
                            maxLength={maxLength}
                            multiline={multiline}
                            returnKeyType={multiline ? 'next' : 'done'}
                            onChangeText={eventTextChange}
                            onEndEditing={eventEndEditing}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onKeyPress={(e) => handleKey(e)}
                            editable={!disabled}
                            testID={testID}
                            autoFocus={autoFocus}
                            defaultValue={defaultValue}
                            autoCapitalize={autoCapitalized || 'none'}
                            textContentType={textContentType || 'none'}
                            dataDetectorTypes="all"
                        />
                        {!disabled && iconClearText}
                        {rightIcon}
                        {customerRightIcon && <Touchable radius={8} onPress={onClickRightIcon} style={styles.styleIconRight}>{customerRightIcon}</Touchable>}
                        {isPassword && <Touchable style={[styles.icPwd, inputStylePwDIcon]} onPress={onPressPwd}>
                            {!isShowPwd ? <ShowPwd /> : <HidePwd />}
                        </Touchable>}

                    </View>
                </Animated.View>
                {errorMessage}
                {isIOS && refArr && renderHeaderKeyBroad}
            </View>
        );
    }
);
