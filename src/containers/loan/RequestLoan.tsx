import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BOTTOM_HEIGHT, Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Button, HeaderBar } from '@/components';
import BackgroundTienNgay from '@/components/BackgroundTienNgay';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions, TypeKeyBoard } from '@/components/elements/textfield/types';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';
import PickerBottomBase, { ItemPickerProps } from '@/components/PickerBottomBase';
import { PickerAction } from '@/components/PickerValuation';
import { useAppStore } from '@/hooks';
import { AddressArrayType, AddressModel, AddressType, ItemPropsModel, PostDataType } from '@/models/common';
import { COLORS, Styles } from '@/theme';
import FormValidate from '@/utils/FormValidate';
import ToastUtils from '@/utils/ToastUtils';
import { CITY_DEFAULT } from '@/commons/constants';
import Navigator from '@/routers/Navigator';
import ScreenNames from '@/commons/ScreenNames';

const RequestLoan = observer(() => {

    const { apiServices, userManager, appManager } = useAppStore();
    const [customerName, setCustomerName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [assetType, setAssetType] = useState<string>('');
    const [address, setAddress] = useState<AddressType>({});
    const [postData, setPossData] = useState<PostDataType>({});

    const [addressArray, setAddressArray] = useState<AddressArrayType>({});
    const [assetTypeArray, setAssetTypeArray] = useState<ItemPropsModel[]>([]);

    const customerNameRef = useRef<TextFieldActions>(null);
    const phoneNumberRef = useRef<TextFieldActions>(null);

    const assetTypeRef = useRef<PickerAction>(null);
    const cityRef = useRef<PickerAction>(null);
    const districtRef = useRef<PickerAction>(null);
    const wardRef = useRef<PickerAction>(null);

    const isFocus = useIsFocused();

    useEffect(() => {
        if (isFocus && userManager?.userInfo) {
            fetchDataCity();
            fetchDataLoanForm();
            onRefresh();
        }
    }, [isFocus]);

    useEffect(() => {
        if (!userManager?.userInfo) {
            Navigator.navigateScreen(ScreenNames.auth);
        }
    }, [userManager?.userInfo, isFocus]);

    const fetchDataCity = useCallback(async () => {
        const getDataCity = await apiServices.common.getCityList();
        if (getDataCity.success) {
            const dataCity = getDataCity.data as AddressModel[];
            const tempCity = dataCity?.map((item: AddressModel) => ({ id: item?._id, value: item?.code, text: item?.name })) as ItemPropsModel[];
            setAddressArray({ cityArray: tempCity });
            const cityDefaultValue = tempCity?.filter((_item: ItemPropsModel) => _item?.value === CITY_DEFAULT.HA_NOI);
            setAddress({ city: cityDefaultValue?.[0]?.text });
            setPossData({ ...postData, city: cityDefaultValue?.[0]?.value });
            if (cityDefaultValue) {
                const getDataDistrict = await apiServices.common.getDistrictList(cityDefaultValue?.[0]?.value || '');
                if (getDataDistrict.success) {
                    const dataDistrict = getDataDistrict.data as AddressModel[];
                    const tempDistrict = dataDistrict?.map((item: AddressModel) => ({ id: item?._id, value: item?.code, text: item?.name })) as ItemPropsModel[];
                    setAddressArray({ ...addressArray, districtArray: tempDistrict, cityArray: tempCity });
                }
            }
        }
    }, [addressArray, apiServices.common, postData]);

    const fetchDataDistrict = useCallback(async (_code: string) => {
        const getDataDistrict = await apiServices.common.getDistrictList(_code);
        if (getDataDistrict.success) {
            const dataDistrict = getDataDistrict.data as AddressModel[];
            const temp = dataDistrict?.map((item: AddressModel) => ({ id: item?._id, value: item?.code, text: item?.name })) as ItemPropsModel[];
            setAddressArray({ ...addressArray, districtArray: temp });
        }
    }, [addressArray, apiServices.common]);

    const fetchDataWard = useCallback(async (_code: string) => {
        const getDataWard = await apiServices.common.getWardList(_code);
        if (getDataWard.success) {
            const dataWard = getDataWard.data as AddressModel[];
            const temp = dataWard?.map((item: AddressModel) => ({ id: item?._id, value: item?.code, text: item?.name })) as ItemPropsModel[];
            setAddressArray({ ...addressArray, wardArray: temp });
        }
    }, [addressArray, apiServices.common]);

    const fetchDataLoanForm = useCallback(async () => {
        const getDataFormLoan = await apiServices.loanBillServices.getLoanForm();
        if (getDataFormLoan.success) {
            const dataFormLoan = getDataFormLoan.data as Object;
            const arrFormLoan = [] as ItemPropsModel[];

            Object.entries(dataFormLoan).forEach((item: Array<string>, index: number) => {
                if (appManager.isAppInReview) {
                    if (item[1].toLocaleLowerCase().includes('bảo hiểm')) {
                        arrFormLoan.push?.({ id: index, value: `${item[0]}`, text: `${item[1]}` } as ItemPropsModel);
                    }
                } else {
                    arrFormLoan.push?.({ id: index, value: `${item[0]}`, text: `${item[1]}` } as ItemPropsModel);
                }
            });
            setAssetTypeArray(arrFormLoan);
        }
    }, [apiServices.loanBillServices]);

    const renderDivider = useCallback((_title: string) => (
        <View style={styles.dividerContainer}>
            <Text style={styles.dividerText}>{_title}</Text>
            <View style={styles.dividerBarStyle} />
        </View>
    ), []);

    const renderInput = useCallback((_ref: any, _value: string, _placeHolder: string, _label: string, _maxLength: number, _keyboardType?: keyof typeof TypeKeyBoard) => {
        const onChangeText = (text: string) => {
            switch (_placeHolder) {
                case Languages.createLoanBill.customerNameInput:
                    setCustomerName(text);
                    break;
                case Languages.createLoanBill.phoneNumberInput:
                    setPhoneNumber(text);
                    break;
                default:
                    break;
            }
        };

        return (
            <MyTextInput ref={_ref} value={_value} placeHolder={_placeHolder} label={_label} optional stylesContainer={styles.containerInput}
                onChangeText={onChangeText} maxLength={_maxLength} keyboardType={_keyboardType} containerInput={styles.inputTextStyle}
            />
        );
    }, []);

    const renderPicker = useCallback((_ref: any, _value: string, _placeHolder: string, _label: string, _data?: ItemPickerProps[] | any, _disable?: boolean) => {
        const onPressItem = (_valuePress: ItemPickerProps) => {
            switch (_placeHolder) {
                case Languages.createLoanBill.assetChoose:
                    setAssetType(_valuePress?.text || '');
                    setPossData({ ...postData, assetType: _valuePress?.value });
                    break;
                case Languages.createLoanBill.cityChoose:
                    setAddress({ ...address, city: _valuePress?.text || '', district: '', ward: '' });
                    fetchDataDistrict(_valuePress.value || '');
                    setPossData({ ...postData, city: _valuePress?.value, district: '', ward: '' });
                    break;
                case Languages.createLoanBill.districtChoose:
                    setAddress({ ...address, district: _valuePress?.text || '', ward: '' });
                    fetchDataWard(_valuePress?.value || '');
                    setPossData({ ...postData, district: _valuePress?.value, ward: '' });
                    break;
                case Languages.createLoanBill.wardChoose:
                    setAddress({ ...address, ward: _valuePress?.text || '' });
                    setPossData({ ...postData, ward: _valuePress?.value });
                    break;
                default:
                    break;
            }
        };
        return (
            <PickerBottomBase ref={_ref} data={_data} placeholder={_placeHolder} disable={_disable} label={_label} value={_value}
                wrapErrText={styles.wrapErrPickerText} containerStyle={styles.btnPickerContainer} styleText={styles.valuePickerStyle}
                onPressItem={onPressItem} hasDash hasStar
            />
        );

    }, [address, fetchDataDistrict, fetchDataWard, postData]);

    const onRefresh = useCallback(() => {
        setAssetType('');
        customerNameRef.current?.setValue('');
        phoneNumberRef.current?.setValue('');
        assetTypeRef.current?.setErrorMsg('');
        cityRef.current?.setErrorMsg('');
        districtRef.current?.setErrorMsg('');
        wardRef.current?.setErrorMsg('');
    }, []);

    const handleValidate = useCallback(() => {
        const customerNameErr = FormValidate.userNameValidate(customerName);
        const phoneErr = FormValidate.passConFirmPhone(phoneNumber);
        const assetTypeErr = FormValidate.inputNameEmpty(assetType, Languages.errorMsg.emptyAssetField);
        const cityErr = FormValidate.inputNameEmpty(address?.city || '', Languages.errorMsg.emptyCityField);
        const districtErr = address?.city ? FormValidate.inputNameEmpty(address?.district || '', Languages.errorMsg.emptyDistrictField) : '';
        const wardErr = address?.district ? FormValidate.inputNameEmpty(address?.ward || '', Languages.errorMsg.emptyWardField) : '';

        customerNameRef.current?.setErrorMsg(customerNameErr);
        phoneNumberRef.current?.setErrorMsg(phoneErr);
        assetTypeRef.current?.setErrorMsg(assetTypeErr);
        cityRef.current?.setErrorMsg(cityErr);
        districtRef.current?.setErrorMsg(districtErr);
        wardRef.current?.setErrorMsg(wardErr);

        if (`${customerNameErr}${phoneErr}${assetTypeErr}${cityErr}${districtErr}${wardErr}`.length === 0) {
            return true;
        } return false;
    }, [address?.city, address?.district, address?.ward, assetType, customerName, phoneNumber]);

    const handleCreateBill = useCallback(async () => {
        if (handleValidate()) {
            const postDataCreateBill = await apiServices.loanBillServices.createLoanBill(
                customerName, phoneNumber, postData.assetType, postData.city, postData.district, postData.ward);

            if (postDataCreateBill.success) {
                ToastUtils.showSuccessToast(Languages.createLoanBill.successCreate);
                const cityDefaultValue = addressArray.cityArray?.filter((_item: ItemPropsModel) => _item?.value === CITY_DEFAULT.HA_NOI);
                setAddress({ city: cityDefaultValue?.[0]?.text });
                setPossData({ ...postData, city: cityDefaultValue?.[0]?.value });
                onRefresh();
            }
        }
    }, [addressArray.cityArray, apiServices.loanBillServices, customerName, handleValidate, onRefresh, phoneNumber, postData]);

    return (
        <BackgroundTienNgay>
            <View style={styles.container}>
                <HeaderBar title={Languages.createLoanBill.createBill} exitApp isLowerCase noBack />
                <ScrollViewWithKeyboard style={styles.mainContainer} showsVerticalScrollIndicator={false}>
                    {renderDivider(Languages.createLoanBill.customerInfo)}
                    {renderInput(customerNameRef, customerName, Languages.createLoanBill.customerNameInput, Languages.createLoanBill.customerName, 30)}
                    {renderInput(phoneNumberRef, phoneNumber, Languages.createLoanBill.phoneNumberInput, Languages.createLoanBill.phoneNumber, 10, 'NUMERIC')}
                    {renderPicker(assetTypeRef, assetType, Languages.createLoanBill.assetChoose, Languages.createLoanBill.asset, assetTypeArray)}

                    {renderDivider(Languages.createLoanBill.address)}
                    {renderPicker(cityRef, address?.city || '', Languages.createLoanBill.cityChoose, Languages.createLoanBill.city, addressArray.cityArray)}
                    {renderPicker(districtRef, address?.district || '', Languages.createLoanBill.districtChoose, Languages.createLoanBill.district, addressArray?.districtArray, !address.city)}
                    {renderPicker(wardRef, address?.ward || '', Languages.createLoanBill.wardChoose, Languages.createLoanBill.ward, addressArray.wardArray, !address.district)}
                    <Button label={Languages.createLoanBill.createBill} style={styles.btnContainer} isLowerCase onPress={handleCreateBill}
                        buttonStyle={BUTTON_STYLES.GREEN}
                    />
                </ScrollViewWithKeyboard>
            </View>
        </BackgroundTienNgay>
    );
});

export default RequestLoan;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mainContainer: {
        paddingHorizontal: 16,
        paddingTop: 20
    },
    containerInput: {
        marginBottom: 12
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingTop: 4,
        paddingBottom: 16
    },
    dividerText: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7
    },
    dividerBarStyle: {
        borderTopWidth: 1,
        borderColor: COLORS.GRAY_15,
        flex: 1,
        marginLeft: 12
    },
    btnContainer: {
        marginBottom: BOTTOM_HEIGHT + 24,
        marginTop: 12
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
    inputTextStyle: {
        height: Configs.FontSize.size45
    }
});
