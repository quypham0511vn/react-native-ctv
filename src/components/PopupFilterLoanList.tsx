import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Dash from 'react-native-dash';
import Modal from 'react-native-modal';
import moment from 'moment';

import IcArrow from '@/assets/images/ic_black_arrow_bottom.svg';
import IcFilter from '@/assets/images/ic_black_calendar.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { PopupActionTypes } from '@/models/typesPopup';
import { COLORS, IconSize, Styles } from '@/theme';
import BottomSheetComponent from './BottomSheet';
import { Button } from './elements';
import { ItemPickerProps } from './PickerBottomBase';
import MyRangeDatePicker, { MyDatePickerActions } from './MyRangeDatePicker';

type PickerProps = {
    value?: string;
    data?: Array<ItemPickerProps>;
    rightIcon?: any;
    placeDateHolder?: string;
    placeServiceHolder?: string;
    hasPickerBottom?: boolean;
    startDateValue?: string;
    endDateValue?: string;
    onPressItem?: (item: any) => void;
    onPressDatePicker?: () => any;
    onFilter?: (beginDate?: string, finishDate?: string, service?: string) => any;
    onCancel?: () => any;
};

const PopupFilterLoanList = forwardRef<PopupActionTypes, PickerProps>(
    ({ data, rightIcon, placeDateHolder, placeServiceHolder, hasPickerBottom, startDateValue, endDateValue, onPressItem, onPressDatePicker, onCancel, onFilter }: PickerProps, ref) => {

        const [visible, setVisible] = useState<boolean>(false);
        const [service, setService] = useState<string>('');
        const [serviceCode, setServiceCode] = useState<string>('');
        const [selectedStartDate, setSelectedStartDate] = useState<string>('');
        const [selectedEndDate, setSelectedEndDate] = useState<string>('');

        const bottomSheetRef = useRef<PopupActionTypes>(null);
        const datePickerRef = useRef<MyDatePickerActions>(null);

        useEffect(() => {
            setSelectedStartDate(startDateValue || '');
            setSelectedEndDate(endDateValue || '');
        }, [endDateValue, startDateValue]);

        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide,
            setContent
        }));

        const onOpenPicker = useCallback(() => {
            setVisible(false);
            bottomSheetRef.current?.show();
        }, []);

        const onReOpenModal = useCallback(() => {
            setVisible(true);
            bottomSheetRef.current?.hide?.();
        }, []);

        const onChangeValue = useCallback((item: any) => {
            onPressItem?.(item);
            bottomSheetRef.current?.hide?.();
            setTimeout(() => {
                show();
                setService(item?.text);
                setServiceCode(item?.value);
            }, 200);
        }, [onPressItem, show]);

        const onCancelBtn = useCallback(() => {
            onCancel?.();
            // hide?.();
            setService?.('');
            setServiceCode?.('');
            setSelectedStartDate('');
            setSelectedEndDate('');
        }, [onCancel]);

        const setContent = useCallback(() => {
            hide?.();
            setService?.('');
            setServiceCode?.('');
            setSelectedStartDate('');
            setSelectedEndDate('');
        }, [hide]);

        const onFilterBtn = useCallback(() => {
            onFilter?.(selectedStartDate, selectedEndDate, serviceCode);
            hide?.();
        }, [hide, onFilter, selectedEndDate, selectedStartDate, serviceCode]);

        const onOpenDatePicker = useCallback(() => {
            onPressDatePicker?.();
            datePickerRef.current?.show?.();
        }, [onPressDatePicker]);

        const onDateChange = useCallback((startDate?: string, endDate?: string) => {
            setSelectedStartDate(startDate || '');
            setSelectedEndDate(endDate || '');
            if (startDate && !endDate) {
                setSelectedEndDate(moment.utc(new Date()).format('DD/MM/YYYY'));
            }
        }, []);

        return (
            <>
                <Modal
                    isVisible={visible}
                    animationIn="slideInUp"
                    useNativeDriver={true}
                    onBackdropPress={hide}
                    avoidKeyboard={true}
                    hideModalContentWhileAnimating
                >
                    <View style={styles.popup}>
                        <Text style={styles.searchStyle}>{Languages.common.search}</Text>
                        <View style={styles.dashContainer}>
                            <Dash dashThickness={1} dashLength={12} dashColor={COLORS.GRAY_14} dashGap={6} />
                        </View>

                        <TouchableOpacity onPress={onOpenDatePicker} style={styles.dateContainer} >
                            {selectedStartDate ? <Text style={styles.filterValueText}>{`${!selectedStartDate ? Languages.historyPayment.startDate : selectedStartDate} --> ${!selectedEndDate ? Languages.historyPayment.endDate : selectedEndDate}`}</Text> : <Text style={styles.filterText}>{placeDateHolder || Languages.listLoanBill.dateChoose}</Text>}
                            <View style={styles.icContainer}><IcFilter /></View>
                        </TouchableOpacity>

                        {hasPickerBottom && <TouchableOpacity style={styles.serviceContainer} onPress={onOpenPicker}>
                            {service ? <Text style={styles.filterValueText}>{service}</Text> : <Text style={styles.filterText}>{placeServiceHolder || Languages.listLoanBill.serviceProductChoose}</Text>}
                            <View style={styles.icContainer}><IcArrow {...IconSize.size8_8} /></View>
                        </TouchableOpacity>}

                        <View style={styles.btnAllContainer}>
                            <Button
                                style={styles.btn}
                                label={Languages.common.search}
                                buttonStyle={'GREEN'}
                                onPress={onFilterBtn}
                                textStyle={styles.searchText}
                                isLowerCase
                            />
                            <Button
                                style={styles.btn}
                                label={Languages.common.cancel}
                                buttonStyle={'GRAY'}
                                onPress={onCancelBtn}
                                textStyle={styles.cancelText}
                                isLowerCase
                            />
                        </View>
                    </View>
                    <MyRangeDatePicker ref={datePickerRef} title={Languages.common.search} onConfirm={onDateChange} backdropOpacity={-0.1} />
                </Modal>

                <BottomSheetComponent
                    ref={bottomSheetRef}
                    data={data}
                    onPressItem={onChangeValue}
                    hasDash={true}
                    rightIcon={rightIcon}
                    placeholderSearch={Languages.common.search}
                    onPressBackDrop={onReOpenModal}
                />
            </>

        );
    });

export default PopupFilterLoanList;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 6,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
    },
    dateContainer: {
        width: '100%',
        paddingHorizontal: 16,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: COLORS.GRAY_11,
        justifyContent: 'space-between',
        borderRadius: 60,
        alignItems: 'center',
        marginTop: 16
    },
    serviceContainer: {
        width: '100%',
        paddingHorizontal: 16,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: COLORS.GRAY_11,
        justifyContent: 'space-between',
        borderRadius: 60,
        alignItems: 'center',
        marginTop: 12
    },
    btnAllContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    btn: {
        marginTop: 16,
        flex: 0.48
    },
    searchStyle: {
        ...Styles.typography.medium,
        color: COLORS.GREEN_3,
        fontSize: Configs.FontSize.size16,
        paddingBottom: 8
    },
    filterText: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size14,
        paddingVertical: 8
    },
    filterValueText: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_13,
        fontSize: Configs.FontSize.size14,
        paddingVertical: 8
    },
    icContainer: {
        flex: 0.1,
        alignItems: 'center'
    },
    dashContainer: {
        width: '100%'
    },
    dateDropdownContainer: {
        paddingTop: 112
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
