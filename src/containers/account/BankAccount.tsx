import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import HTMLView from 'react-native-htmlview';

import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { Button } from '@/components/elements/button/index';
import { MyTextInput } from '@/components/elements/textfield/index';
import { TextFieldActions, TypeCapitalized, TypeKeyBoard } from '@/components/elements/textfield/types';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import FormValidate from '@/utils/FormValidate';
import ToastUtils from '@/utils/ToastUtils';
import { COLORS, HtmlStylesSeen, Styles } from '../../theme';
import { PickerAction } from '@/components/PickerValuation';
import PickerBottomBase, { ItemPickerProps } from '@/components/PickerBottomBase';
import BackgroundTienNgay from '@/components/BackgroundTienNgay';
import { BankModel, BankUserModel, ItemPropsModel } from '@/models/common';
import Navigator from '@/routers/Navigator';

const BankAccount = observer(() => {

    const { apiServices } = useAppStore();

    const [bankNumber, setBankNumber] = useState<string>('');
    const [ownerName, setOwnerName] = useState<string>('');
    const [bankName, setBankName] = useState<string>('');
    const [bankCode, setBankCode] = useState<string>('');
    const [bankArray, setBankArray] = useState<ItemPickerProps[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);

    const bankNameRef = useRef<PickerAction>(null);
    const ownerNameRef = useRef<TextFieldActions>(null);
    const bankNumberRef = useRef<TextFieldActions>(null);
    const isFocus = useIsFocused();

    useEffect(() => {
        if (isFocus) {
            fetchBankList();
            fetchListBankUser();
        }
    }, [isFocus]);

    const fetchListBankUser = useCallback(async () => {
        setLoading(true);
        const resListBankUser = await apiServices.common.getListBankUser();
        setLoading(false);
        if (resListBankUser.success) {
            if (resListBankUser.data) {
                const _data = resListBankUser?.data as BankUserModel[];
                if (_data.length) {
                    const dataBank = _data[0];
                    setBankName(dataBank.bank.name || '');
                    setBankNumber(dataBank.stk_user || '');
                    setOwnerName(dataBank.name_user || '');
                    setBankCode(dataBank.bank.code || '');
                    setIsEdit(true);
                }
            }
        }
    }, []);

    const fetchBankList = useCallback(async () => {
        const fetchBankArray = await apiServices.common.getBankList();
        if (fetchBankArray.success) {
            const bankList = fetchBankArray.data as BankModel[];
            const temp = bankList?.map((item) => ({ id: item?.id, value: item?.code, text: item?.name, icon: item?.logo })) as ItemPropsModel[];
            // const firstName = temp?.filter((item) => item?.value === bankName) as ItemPropsModel[];
            setBankArray(temp);
            // setBankName(firstName?.[0]?.text || '');
            // setBankCode(firstName?.[0]?.value || '');
        }
    }, [apiServices.common]);

    const renderPicker = useCallback((_ref: any, _value: string, _placeHolder: string, _label: string, _data?: ItemPickerProps[] | any, _isEdit?: boolean) => {
        const onPressItem = (_valuePress: ItemPickerProps) => {
            setBankName(_valuePress?.text || '');
            setBankCode(_valuePress?.value || '');
        };
        return (
            <PickerBottomBase ref={_ref} data={_data} placeholder={_placeHolder} label={_label} value={_value}
                wrapErrText={styles.wrapErrPickerText} containerStyle={styles.btnPickerContainer} styleText={styles.valuePickerStyle}
                onPressItem={onPressItem} hasDash hasStar={!_isEdit} disable={_isEdit}
            />
        );

    }, []);

    const renderInput = useCallback((_ref: any, _title: any, _placeHolder: any, _value: string, maxLength: number, keyBoardType: keyof typeof TypeKeyBoard, _isEdit: boolean) => <View style={styles.groupInput}>
        <MyTextInput
            value={_value}
            placeHolder={_placeHolder}
            containerInput={styles.input}
            label={_title}
            ref={_ref}
            maxLength={maxLength}
            keyboardType={keyBoardType}
            autoCapitalized={TypeCapitalized.CHARACTERS}
            wrapErrText={styles.wrapErrInputText}
            optional={!_isEdit}
            disabled={_isEdit}
        />
    </View>, []);

    const onValidation = useCallback(() => {
        const errMsgBankName = FormValidate.inputNameEmpty(bankCode, Languages.errorMsg.emptyBankName);
        const errMsgBankNumber = FormValidate.inputNameEmpty(bankNumberRef.current?.getValue(), Languages.errorMsg.emptyBankNumber);
        const errMsgOwnerName = FormValidate.inputNameEmpty(ownerNameRef.current?.getValue(), Languages.errorMsg.emptyOwnerAccount);

        bankNameRef.current?.setErrorMsg(errMsgBankName);
        bankNumberRef.current?.setErrorMsg(errMsgBankNumber);
        ownerNameRef.current?.setErrorMsg(errMsgOwnerName);

        if (`${errMsgBankName}${errMsgBankNumber}${errMsgOwnerName}`.length === 0) {
            return true;
        }
        return false;
    }, [bankCode]);

    const handleSaveBankInfo = useCallback(async () => {
        const _ownerName = ownerNameRef.current?.getValue();
        const _bankNumber = bankNumberRef.current?.getValue();
        if (onValidation()) {
            setLoading(true);
            const res = await apiServices.auth.addBankAccount(_ownerName, _bankNumber, bankCode);
            setLoading(false);
            if (res.success) {
                Navigator.goBack();
                ToastUtils.showSuccessToast(Languages.bankAccount.addAcc);
            }
        }
    }, [apiServices.auth, bankCode, onValidation]);

    const onEdit = useCallback(() => {
        setBankName('');
        setBankCode('');
        bankNumberRef.current?.setValue('');
        ownerNameRef.current?.setValue('');
        setIsEdit(false);
    }, []);

    const renderViewInput = useMemo(() => (
        <View style={styles.group}>
            {renderPicker(bankNameRef, bankName || '', Languages.bankAccount.bankChoose, Languages.bankAccount.bank, bankArray, isEdit)}
            {renderInput(bankNumberRef, Languages.bankAccount.bankNumber, Languages.bankAccount.bankNumberInput, bankNumber, 16, isEdit ? 'DEFAULT' : 'NUMERIC', isEdit)}
            {renderInput(ownerNameRef, Languages.bankAccount.ownerAcc, Languages.bankAccount.ownerAccName, ownerName, 30, 'DEFAULT', isEdit)}
        </View>
    ), [renderPicker, bankName, bankArray, isEdit, renderInput, bankNumber, ownerName]);

    return (
        <BackgroundTienNgay >
            <View style={styles.container}>
                <HeaderBar title={Languages.bankAccount.bankAccount} isLowerCase />

                <ScrollViewWithKeyboard showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
                    {renderViewInput}
                    <HTMLView
                        value={Languages.bankAccount.note}
                        stylesheet={HtmlStylesSeen || undefined} />
                    <View style={styles.viewBtn}>
                        <Button radius={25} onPress={isEdit ? onEdit : handleSaveBankInfo} label={isEdit ? Languages.profileAuth.edit : Languages.bankAccount.saveAcc} isLowerCase
                            buttonStyle={BUTTON_STYLES.GREEN} />
                    </View>
                </ScrollViewWithKeyboard>

                {isLoading && <MyLoading isOverview />}
            </View>
        </BackgroundTienNgay>
    );
});

export default BankAccount;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    group: {
        paddingTop: 20
    },
    groupInput: {
        marginBottom: 12
    },
    scrollContainer: {
        paddingHorizontal: 16
    },
    title: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_17,
        marginBottom: 5
    },
    button: {
        width: '100%',
        marginTop: 12
    },
    input: {
        height: Configs.FontSize.size45,
        borderRadius: 50
    },
    btnPickerContainer: {
        justifyContent: 'space-between',
        marginBottom: 12
    },
    valuePickerStyle: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_7
    },
    wrapErrPickerText: {
        paddingHorizontal: 12
    },
    wrapErrInputText: {
        paddingHorizontal: 5
    },
    viewBtn: {
        paddingVertical: 10
    }
});

