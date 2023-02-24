import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { PAGE_LENGTH } from '@/api/constants';
import IcFilter from '@/assets/images/ic_black_slider.svg';
import { BOTTOM_HEIGHT } from '@/commons/Configs';
import { FilterLoanList } from '@/commons/constants';
import Languages from '@/commons/Languages';
import { HeaderBar } from '@/components';
import BackgroundTienNgay from '@/components/BackgroundTienNgay';
import { TextFieldActions } from '@/components/elements/textfield/types';
import HideKeyboard from '@/components/HideKeyboard';
import InputSearchComponent from '@/components/InputSearchComponent';
import KeyValueLoanList from '@/components/KeyValueLoanList';
import MyFlatList from '@/components/MyFlatList';
import MyLoading from '@/components/MyLoading';
import PopupFilterLoanList from '@/components/PopupFilterLoanList';
import { useAppStore } from '@/hooks';
import { ItemPropsModel } from '@/models/common';
import { LoanBillModel } from '@/models/loan-list';
import { PopupActionTypes } from '@/models/typesPopup';
import { COLORS, IconSize, Styles } from '@/theme';
import DateUtils from '@/utils/DateUtils';
import EmptyComponent from '@/components/EmptyComponent';

type FilterSearch = {
    startDate?: string,
    finishDate?: string,
    serviceName?: string,
}

const LoanBillingList = observer(({ route }: { route: any }) => {
    const { apiServices } = useAppStore();
    const [dataArray, setDataArray] = useState<Array<LoanBillModel[]>>([]);

    const [search, setSearch] = useState<string>('');
    const [serviceProductArray, setServiceProductArray] = useState<ItemPropsModel[]>([]);
    const [typeFilter, setTypeFilter] = useState<number>(1);

    const [filterSearch, setFilterSearch] = useState<FilterSearch>({});

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [canLoadMore, setLoadMore] = useState<boolean>(true);
    const [lastId, setLastId] = useState<number>(0);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true);
    const pageSize = 3;

    const inputSearchRef = useRef<TextFieldActions>(null);
    const popupFilterRef = useRef<PopupActionTypes>(null);

    const isFocus = useIsFocused();

    useEffect(() => {
        if (isFocus) {
            setDataArray([]);
            fetchData(false, 1);
            fetchDataService();
            setFilterSearch({});
            inputSearchRef.current?.setValue('');
            popupFilterRef.current?.setContent?.('');
            setTypeFilter(1);
            setLastId(0);
        }
    }, [isFocus]);

    const fetchDataService = useCallback(async () => {
        const getDataFormLoan = await apiServices.loanBillServices.getLoanForm();
        if (getDataFormLoan.success) {
            const dataService = getDataFormLoan.data as Object;
            const arrService = [] as ItemPropsModel[];

            Object.entries(dataService).forEach((item: Array<string>, index: number) => {
                arrService.push?.({ id: index, value: `${item[0]}`, text: `${item[1]}` } as ItemPropsModel);
            });
            setServiceProductArray(arrService);
        }
    }, [apiServices.loanBillServices]);

    const fetchData = useCallback(async (isLoadMore?: boolean, _typeFilter?: number, _startDate?: string, _finishDate?: string, servicesName?: string, textSearch?: string) => {
        setIsRefreshing(!isLoadMore);
        let resBillData = [] as any;
        if (!route?.params?.isBack) {
            resBillData = await apiServices.history.getLoanList(
                pageSize,
                isLoadMore ? lastId : 0,
                _typeFilter,
                DateUtils.convertBirthdayDate(_startDate || ''), // format: 2022-11-01
                DateUtils.convertBirthdayDate(_finishDate || ''),
                servicesName || '',
                textSearch || '');
        }
        else {
            resBillData = await apiServices.history.getLoanListGroup(
                pageSize,
                isLoadMore ? lastId : 0,
                _typeFilter,
                DateUtils.convertBirthdayDate(_startDate || ''),
                DateUtils.convertBirthdayDate(_finishDate || ''),
                servicesName || '',
                textSearch || ''
            );
        };
        setIsRefreshing(false);
        const dataBill = resBillData?.data as Array<LoanBillModel[]>;
        if (resBillData.success && dataBill?.length > 0) {
            if (isLoadMore) {

                setDataArray(last => [...last, ...dataBill]);
            } else {
                setDataArray(dataBill);
            }
            setLastId(last => last + pageSize);
        } 
        setLoadMore(dataBill?.length === pageSize);

    }, [apiServices.history, lastId, pageSize, route?.params?.isBack]);

    const handleFilterOption = useCallback((_id: number) => {
        setDataArray([]);
        setLastId(0);
        setTypeFilter(Number(_id));
        inputSearchRef.current?.setValue('');
        setFilterSearch({ startDate: '', finishDate: '', serviceName: '' });
        fetchData(false, _id);
        popupFilterRef.current?.setContent?.('');
    }, [fetchData]);

    const renderFilterItem = useCallback((data?: ItemPropsModel[]) => (
        <View style={styles.filterAllContainer}>
            {data?.map((item: ItemPropsModel, index: number) => {
                const onFilterItems = () => {
                    handleFilterOption(Number(item?.id));
                };
                return (
                    <TouchableOpacity key={index} style={typeFilter === item?.id ? styles.filterItemContainer : styles.disableFilterItemContainer} onPress={onFilterItems} disabled={typeFilter === item?.id}>
                        <Text style={typeFilter === item?.id ? styles.filterTitleStyle : styles.disableFilterTitleStyle}>{item?.text}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    ), [handleFilterOption, typeFilter]);

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
        fetchDataService();
        setFilterSearch({});
        inputSearchRef.current?.setValue('');
        popupFilterRef.current?.setContent?.('');
        fetchData(false, typeFilter);
        setLastId(0);
    }, [fetchData, fetchDataService, typeFilter]);

    const renderFooter = useMemo(() => <View>
        {canLoadMore && <MyLoading />}
    </View>, [canLoadMore]);

    // eslint-disable-next-line consistent-return
    const renderEmpty = useMemo(() => {
        if (dataArray.length === 0 && !isRefreshing) {
            return (
                <EmptyComponent />
            );
        }
    }, [dataArray.length, isRefreshing]);

    const onMomentumScrollBegin = useCallback(() => {
        setOnEndReachedCalledDuringMomentum(false);
        if (dataArray.length === 0) {
            setLoadMore(false);
        }
    }, [dataArray.length]);

    const onEndReached = useCallback(() => {
        console.log('canLoadMore ==', canLoadMore);
        if (!onEndReachedCalledDuringMomentum && canLoadMore) {
            fetchData(true, typeFilter, filterSearch.startDate, filterSearch.finishDate, filterSearch.serviceName, search);
            setOnEndReachedCalledDuringMomentum(true);
        }
    }, [canLoadMore, fetchData, filterSearch.finishDate, filterSearch.serviceName, filterSearch.startDate, onEndReachedCalledDuringMomentum, search, typeFilter]);

    const onOpenPopupFilter = useCallback(() => {
        popupFilterRef.current?.show();
    }, []);

    const onPressInputSearch = useCallback((value?: string) => {
        setLastId(0);
        setDataArray([]);
        fetchData(false, typeFilter, filterSearch.startDate, filterSearch.finishDate, filterSearch.serviceName, value);
    }, [fetchData, filterSearch.finishDate, filterSearch.serviceName, filterSearch.startDate, typeFilter]);

    const renderSearch = useMemo(() => {
        const handleSearch = (value: string) => {
            setSearch(value);
        };
        return (
            <View style={styles.searchAllContainer}>
                <InputSearchComponent ref={inputSearchRef} onChangeText={handleSearch} value={search} placeHolder={Languages.listLoanBill.inputSearch} onPressSearch={onPressInputSearch} />
                <TouchableOpacity style={styles.icFilterStyle} onPress={onOpenPopupFilter}>
                    <IcFilter  {...IconSize.size25_25} />
                </TouchableOpacity>
            </View>
        );
    }, [onOpenPopupFilter, onPressInputSearch, search]);

    const renderLoanList = useMemo(() =>
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

    const onPressFilter = useCallback((beginDate?: string, endDate?: string, serviceProduct?: string) => {
        setDataArray([]);
        setLastId(0);
        setFilterSearch({ startDate: beginDate, finishDate: endDate, serviceName: serviceProduct });
        fetchData(false, typeFilter, beginDate, endDate, serviceProduct, search);
    }, [fetchData, search, typeFilter]);

    const onCloseModalFilter = useCallback(() => {
        setFilterSearch({ startDate: '', finishDate: '', serviceName: '' });
        if (filterSearch.startDate?.length !== 0 || filterSearch.finishDate?.length !== 0 || filterSearch.serviceName?.length !== 0) {
            fetchData(false, typeFilter, undefined, undefined, undefined, search);
        }
    }, [fetchData, filterSearch.finishDate, filterSearch.serviceName, filterSearch.startDate, search, typeFilter]);

    return (
        <BackgroundTienNgay style={styles.backgroundContainer} >
            <View style={styles.container}>
                <HeaderBar title={Languages.listLoanBill.loanList} isLowerCase noBack={!route?.params?.isBack} />
                <HideKeyboard style={styles.mainContainer}>
                    <>
                        {renderFilterItem(FilterLoanList)}
                        {renderSearch}
                        {renderLoanList}
                    </>
                </HideKeyboard>
                <PopupFilterLoanList ref={popupFilterRef} data={serviceProductArray} onFilter={onPressFilter} onCancel={onCloseModalFilter} hasPickerBottom />
            </View>
            {isRefreshing && <MyLoading isOverview />}
        </BackgroundTienNgay>
    );
});

export default LoanBillingList;
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
    filterAllContainer: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 24
    },
    filterItemContainer: {
        flex: 0.32,
        backgroundColor: COLORS.GREEN_2,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 60
    },
    disableFilterItemContainer: {
        flex: 0.32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 60
    },
    filterTitleStyle: {
        ...Styles.typography.regular,
        color: COLORS.WHITE,
        paddingVertical: 5
    },
    disableFilterTitleStyle: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_13,
        paddingVertical: 5
    },
    flatListContent: {
        marginTop: 24,
        paddingHorizontal: 16,
        paddingBottom: BOTTOM_HEIGHT + 24
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
    styleValueGreenColor: {
        ...Styles.typography.medium,
        color: COLORS.GREEN_2
    },
    styleValueRedColor: {
        ...Styles.typography.medium,
        color: COLORS.RED_2
    },
    searchAllContainer: {
        flexDirection: 'row',
        width: '100%',
        marginTop: 12,
        paddingHorizontal: 16,
        alignItems: 'center'
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
    }
});

