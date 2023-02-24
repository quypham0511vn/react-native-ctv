import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import HTMLView from 'react-native-htmlview';

import { Configs } from '@/commons/Configs';
import { COLORS, HtmlStylesSeen, Styles } from '@/theme';
import Languages from '@/commons/Languages';
import { TextFieldActions } from './elements/textfield/types';
import { MyTextInput } from './elements/textfield';
import { Button } from './elements';
import FormValidate from '@/utils/FormValidate';

export type PopupProps = {
    onClose?: () => any;
    onConfirm?: (value1?: string, value2?: string) => any;
    onBackdropPress?: () => any;
    content?: string;
    btnText?: string;
    description?: string;
    title?: string
};

export type PopupActions = {
    show: (content?: string) => any;
    hide: (content?: string) => any;
    setContent?: (message: string) => void
};

const PopupAddStaff = forwardRef<PopupActions, PopupProps>(
    ({
        onClose,
        title,
        description,
        onConfirm
    }: PopupProps, ref) => {
        const [visible, setVisible] = useState<boolean>(false);
        const refName = useRef<TextFieldActions>(null);
        const refPhone = useRef<TextFieldActions>(null);

        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const onCancel = useCallback(() => {
            refName.current?.setValue('');
            refPhone.current?.setValue('');
            onClose?.();
        }, [onClose]);

        const onValidate = useCallback(() => {
            const errName = FormValidate.userNameValidate(refName.current?.getValue() || '');
            const errPhone = FormValidate.passConFirmPhone(refPhone.current?.getValue() || '');
            refName.current?.setErrorMsg(errName);
            refPhone.current?.setErrorMsg(errPhone);
            if (`${errName}${errPhone}`.length === 0) return true;
            return false;
        }, []);

        const onCreate = useCallback(() => {
            if (onValidate()) {
                onConfirm?.(refName.current?.getValue(), refPhone.current?.getValue());
                hide();
            }
        }, [hide, onConfirm, onValidate]);

        return (
            <Modal
                isVisible={visible}
                animationIn="slideInUp"
                useNativeDriver={true}
                onBackdropPress={hide}
                avoidKeyboard={true}
                onDismiss={onCancel}
                hideModalContentWhileAnimating
            >
                <View style={styles.popup}>
                    <Text style={styles.txtTitle}>{title}</Text>

                    <MyTextInput
                        label={Languages.groupManager.nameStaff}
                        ref={refName}
                        placeHolder={Languages.loan.enterFullName}
                        maxLength={50}
                        keyboardType={'DEFAULT'}
                        containerInput={styles.formInput}
                        wrapErrText={styles.wrapErrPickerText}
                        stylesContainer={styles.viewContainerInput}
                        labelStyle={styles.label}
                    />
                    <MyTextInput
                        label={Languages.groupManager.phoneStaff}
                        ref={refPhone}
                        placeHolder={Languages.loan.enterPhoneNumber}
                        maxLength={10}
                        keyboardType={'NUMBER'}
                        containerInput={styles.formInput}
                        wrapErrText={styles.wrapErrPickerText}
                        stylesContainer={styles.viewContainerInput}
                        labelStyle={styles.label}
                    />
                    <HTMLView
                        value={`${description}`}
                        stylesheet={HtmlStylesSeen || undefined} />
                    <View style={styles.btnAllContainer}>
                        <Button
                            style={styles.btn}
                            label={Languages.common.cancel}
                            buttonStyle={'GRAY'}
                            onPress={onCancel}
                            textStyle={styles.cancelText}
                            isLowerCase
                        />
                        <Button
                            style={styles.btn}
                            label={Languages.groupManager.create}
                            onPress={onCreate}
                            buttonStyle={'GREEN'}
                            textStyle={styles.searchText}
                            isLowerCase
                        />
                    </View>
                </View>
            </Modal>
        );
    });

export default PopupAddStaff;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 6,
        borderWidth: 1,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ic: {
        marginTop: 10,
        marginBottom: -10,
        width: Configs.IconSize.size39,
        height: Configs.IconSize.size39
    },
    txtTitle: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16,
        color: COLORS.BLACK,
        textAlign: 'center',
        marginVertical: 20
    },
    txtContent: {
        ...Styles.typography.regular,
        marginVertical: 10,
        marginHorizontal: 10,
        textAlign: 'center'
    },
    btn: {
        width: '48%',
        marginTop: 10
    },
    formInput: {
        height: Configs.FontSize.size45
    },
    wrapErrPickerText: {
        paddingHorizontal: 4
    },
    viewContainerInput: {
        width: '100%',
        paddingHorizontal: 16,
        marginBottom: 10
    },
    label: {
        color: COLORS.GRAY_17,
        fontSize: Configs.FontSize.size14,
        fontFamily: Configs.FontFamily.medium
    },
    btnAllContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 20
    },
    searchText: {
        ...Styles.typography.medium,
        color: COLORS.WHITE
    },
    cancelText: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_12
    }
});
