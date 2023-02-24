import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { LINKS, PAGE_LENGTH } from '@/api/constants';
import IcFilter from '@/assets/images/ic_black_calendar.svg';
import IcWarning from '@/assets/images/ic_white_warning_circle.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar } from '@/components';
import BackgroundTienNgay from '@/components/BackgroundTienNgay';
import { TextFieldActions } from '@/components/elements/textfield/types';
import EmptyComponent from '@/components/EmptyComponent';
import HideKeyboard from '@/components/HideKeyboard';
import KeyValueLoanList from '@/components/KeyValueLoanList';
import MyFlatList from '@/components/MyFlatList';
import MyLoading from '@/components/MyLoading';
import MyRangeDatePicker, { MyDatePickerActions } from '@/components/MyRangeDatePicker';
import { PopupActions } from '@/components/popup/types';
import PopupPolicy from '@/components/PopupPolicy';
import { useAppStore } from '@/hooks';
import { LoanBillModel } from '@/models/loan-list';
import { PopupActionTypes } from '@/models/typesPopup';
import { COLORS, Styles } from '@/theme';
import DateUtils from '@/utils/DateUtils';
import { SCREEN_HEIGHT } from '@/utils/ScreenUtils';

const History = observer(() => {
    const { apiServices } = useAppStore();
    const [dataArray, setDataArray] = useState<Array<LoanBillModel[]>>([]);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [canLoadMore, setLoadMore] = useState<boolean>(true);
    const [selectedStartDate, setSelectedStartDate] = useState<string>('');
    const [selectedEndDate, setSelectedEndDate] = useState<string>('');
    const [lastId, setLastId] = useState<number>(0);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true);
    const pageSize = 2;

    const inputSearchRef = useRef<TextFieldActions>(null);
    const popupFilterRef = useRef<PopupActionTypes>(null);
    const popupWarningRef = useRef<PopupActions>(null);
    const datePickerRef = useRef<MyDatePickerActions>(null);

    const isFocus = useIsFocused();

    useLayoutEffect(() => {
        if (isFocus) {
            fetchData(false);
            inputSearchRef.current?.setValue('');
            popupFilterRef.current?.setContent?.('');
            setLastId(0);
            setSelectedStartDate('');
            setSelectedEndDate('');
            setDataArray([]);
        }
    }, [isFocus]);

    const fetchData = useCallback(async (isLoadMore?: boolean, _startDate?: string, _finishDate?: string) => {
        setIsRefreshing(!isLoadMore);
        const resPaymentHistory = await apiServices.history.getPaymentHistoryList(
            pageSize,
            isLoadMore ? lastId : 0,
            DateUtils.convertReverseDate(_startDate || ''), // format: 2022/11/01
            DateUtils.convertReverseDate(_finishDate || '')
        );
        setIsRefreshing(false);
        const dataPaymentMethod = resPaymentHistory?.data as Array<LoanBillModel[]>;
        if (resPaymentHistory.success && dataPaymentMethod.length > 0) {
            if (isLoadMore) {
                setDataArray(last => [...last, ...dataPaymentMethod]);
            } else {
                setDataArray(dataPaymentMethod);
            }
            setLastId(last => last + pageSize);
        } 
        setLoadMore(dataPaymentMethod?.length === pageSize);

    }, [apiServices.history, lastId, pageSize]);

    const keyExtractor = useCallback((item: LoanBillModel[], index: number) => `${index}`, []);

    const renderItemLoanList = useCallback(({ item, index }: { item: LoanBillModel[], index: number }) => (
        <View key={index} style={styles.itemLoanListContainer}>
            {item?.map((itemChild: LoanBillModel, indexChild: number) => (
                <View key={indexChild} >
                    <KeyValueLoanList label={itemChild?.key || ''} value={itemChild?.value} noIndicator={indexChild === item.length - 1} colorValue={itemChild?.color} />
                </View>)
            )}
        </View>
    ), []);

    const onRefresh = useCallback(() => {
        setDataArray([]);
        inputSearchRef.current?.setValue('');
        popupFilterRef.current?.setContent?.('');
        setSelectedStartDate('');
        setSelectedEndDate('');
        fetchData(false);
        setLastId(0);
    }, [fetchData]);

    const renderFooter = useMemo(() => <View>
        {canLoadMore && <MyLoading />}
    </View>, [canLoadMore]);

    // eslint-disable-next-line consistent-return
    const renderEmpty = useMemo(() => {
        if (dataArray.length === 0 && !isRefreshing && !canLoadMore) {
            return (
                <EmptyComponent />
            );
        }
    }, [canLoadMore, dataArray.length, isRefreshing]);

    const onMomentumScrollBegin = useCallback(() => {
        setOnEndReachedCalledDuringMomentum(false);
        if (dataArray.length === 0) {
            setLoadMore(false);
        }
    }, [dataArray.length]);

    const onEndReached = useCallback(() => {
        if (!onEndReachedCalledDuringMomentum && canLoadMore) {
            fetchData(true, selectedStartDate, selectedEndDate);
            setOnEndReachedCalledDuringMomentum(true);
        }
    }, [onEndReachedCalledDuringMomentum, canLoadMore, fetchData, selectedStartDate, selectedEndDate]);


    const onOpenPopupWarning = useCallback(() => {
        popupWarningRef.current?.show();
    }, []);

    const onOpenDatePicker = useCallback(() => {
        datePickerRef.current?.show?.();
    }, []);

    const renderSearch = useMemo(() => (
        <View style={styles.searchAllContainer}>
            <TouchableOpacity style={styles.dateContainer} onPress={onOpenDatePicker}>
                {selectedStartDate ?
                    <Text style={styles.filterValueText}>{`${!selectedStartDate ? Languages.historyPayment.startDate : selectedStartDate} --> ${!selectedEndDate ? Languages.historyPayment.endDate : selectedEndDate}`}</Text>
                    : <Text style={styles.filterText}>{Languages.listLoanBill.dateChoose}</Text>}
                <View style={styles.icContainer}><IcFilter /></View>
            </TouchableOpacity>
        </View>
    ), [onOpenDatePicker, selectedEndDate, selectedStartDate]);

    const renderPaymentHistoryList = useMemo(() =>
        <MyFlatList
            contentContainerStyle={styles.flatListContent}
            data={dataArray}
            renderItem={renderItemLoanList}
            showsHorizontalScrollIndicator={true}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onEndReachedThreshold={0.01}
            showsVerticalScrollIndicator={false}
            {... { keyExtractor }}
        />, [dataArray, renderItemLoanList, renderFooter, renderEmpty, isRefreshing, onRefresh, onEndReached, onMomentumScrollBegin, keyExtractor]);

    const onPressFilter = useCallback((beginDate?: string, endDate?: string) => {
        setDataArray([]);
        fetchData(false, beginDate, endDate);

    }, [fetchData]);

    const onCloseModalFilter = useCallback(() => {
        setSelectedStartDate('');
        setSelectedEndDate('');
        fetchData(false, undefined, undefined);
    }, [fetchData]);

    const onDateChange = useCallback((startDate?: string, endDate?: string) => {
        setSelectedStartDate(startDate || '');
        setSelectedEndDate(endDate || '');
        if (startDate && !endDate) {
            setSelectedEndDate(moment.utc(new Date()).format('DD/MM/YYYY'));
            onPressFilter(startDate, moment.utc(new Date()).format('DD/MM/YYYY'));
        } else {
            onPressFilter(startDate, endDate);
        }
    }, [onPressFilter]);

    return (
        <BackgroundTienNgay style={styles.backgroundContainer} >
            <View style={styles.container}>
                <HeaderBar title={Languages.historyPayment.historyPayment} noBack isLowerCase rightIcon={<IcWarning />} rightIconPress={onOpenPopupWarning} />
                <HideKeyboard style={styles.mainContainer}>
                    <>
                        {renderSearch}
                        {renderPaymentHistoryList}
                    </>
                </HideKeyboard>
                <PopupPolicy ref={popupWarningRef} hasBtnClose uri={LINKS.PAYMENT_POLICY} />
            </View>
            <MyRangeDatePicker ref={datePickerRef} title={Languages.common.search} onConfirm={onDateChange} backdropOpacity={0.5} onCancel={onCloseModalFilter} />
            {isRefreshing && <MyLoading isOverview />}
        </BackgroundTienNgay>
    );
});

export default History;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    mainContainer: {
        flex: 1,
        paddingHorizontal: 16
    },
    backgroundContainer: {
        flex: 1
    },
    flatListContent: {
        paddingHorizontal: 16,
        paddingBottom: SCREEN_HEIGHT * 0.1
    },
    itemLoanListContainer: {
        ...Styles.shadow,
        borderColor: COLORS.GRAY_15,
        backgroundColor: COLORS.WHITE,
        borderRadius: 8,
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 8,
        marginBottom: 12
    },
    searchAllContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 10,
        paddingHorizontal: 16,
        alignItems: 'center',
        marginBottom: 20
    },
    icFilterStyle: {
        ...Styles.shadow,
        width: 28,
        height: 28,
        backgroundColor: COLORS.WHITE,
        alignItems: 'center',
        borderRadius: 40,
        justifyContent: 'center',
        marginLeft: 12

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
    filterText: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size14,
        paddingVertical: 8
    }
});

