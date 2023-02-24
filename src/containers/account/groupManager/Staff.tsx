import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import Dash from 'react-native-dash';

import BackGround from '@/assets/images/bg.jpg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar, Touchable } from '@/components';
import KeyToggleValue from '@/components/KeyToggleSwitch';
import MyFlatList from '@/components/MyFlatList';
import MyLoading from '@/components/MyLoading';
import { COLORS, Styles } from '@/theme';
import { useAppStore } from '@/hooks';
import IcNoData from '@/assets/images/ic_no_data.svg';
import { MessageModel, PagingConditionTypes, StaffModel } from '@/models/group-manager';
import { TYPE_STATUS_STAFF } from '@/commons/constants';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/ScreenUtils';
import PopupAddStaff, { PopupActions } from '@/components/popupAddStaff';
import ToastUtils from '@/utils/ToastUtils';
import EmptyComponent from '@/components/EmptyComponent';

const StaffComponent = observer(() => {

    const { apiServices } = useAppStore();
    const [data, setData] = useState<StaffModel[]>([]);
    const [canLoadMoreUI, setCanLoadMoreUI] = useState<boolean>(true);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [toggle, setToggle] = useState<boolean>(false);

    const refPopup = useRef<PopupActions>(null);

    const condition = useRef<PagingConditionTypes>({
        offset: 0,
        isLoading: false,
        canLoadMore: true
    });
    const PAGE_SIZE = 5;

    const fetchListStaff = useCallback(async (isLoadMore?: boolean) => {
        if (condition.current.isLoading) {
            return;
        }
        condition.current.isLoading = true;

        const res = await apiServices.groupManagerServices.getListStaff(PAGE_SIZE, condition.current.offset);
        let totalSize = 0;
        if (res.success) {
            const _data = res.data as StaffModel[];
            totalSize = _data.length || 0;
            if (totalSize > 0) {
                if (isLoadMore) {
                    setData((list) => [...list || [], ..._data]);
                } else {
                    setData(_data);
                }
                condition.current.offset += totalSize;
            }
        }
        condition.current.isLoading = false;
        condition.current.canLoadMore = totalSize >= PAGE_SIZE;
        setCanLoadMoreUI(condition.current.canLoadMore);
    }, [apiServices.groupManagerServices]);

    useEffect(() => {
        fetchListStaff();
    }, [fetchListStaff]);

    const onChangeStatus = useCallback(async (id: string) => {
        setLoading(true);
        const res = await apiServices.groupManagerServices.updateStatus(id);
        setLoading(false);
        if (res.success) {
            setData(last => {
                if (last.filter((item) => item.id === id)[0].status === TYPE_STATUS_STAFF.ACTIVE) {
                    last.filter((item) => item.id === id)[0].status = TYPE_STATUS_STAFF.DEACTIVATE;
                } else {
                    last.filter((item) => item.id === id)[0].status = TYPE_STATUS_STAFF.ACTIVE;
                }
                return last;
            });
            setToggle(last => !last);
        }
    }, [apiServices.groupManagerServices]);

    const renderItem = useCallback(({ item }: any) => {

        const onClickSwitch = () => {
            onChangeStatus(data.filter(itemChild => itemChild.id === item.id)[0]?.id);
        };

        return (
            <View style={[styles.item, styles.box]}>
                <KeyToggleValue
                    label={item.name}
                    isEnabledSwitch={item.status === TYPE_STATUS_STAFF.ACTIVE}
                    styleLabel={styles.txtBold}
                    onToggleSwitch={onClickSwitch}
                />
                <Dash dashColor={COLORS.GRAY_15} style={styles.dash} dashGap={5} dashLength={10} dashThickness={1} />
                <View style={styles.itemTop}>
                    <Text style={styles.txt}>{Languages.groupManager.position}</Text>
                    <Text style={styles.txt}>{item.vi_tri}</Text>
                </View>
                <Dash dashColor={COLORS.GRAY_15} style={styles.dash} dashGap={5} dashLength={10} dashThickness={1} />
                <View style={styles.itemBottom}>
                    <Text style={styles.txt}>{Languages.groupManager.time}</Text>
                    <Text style={styles.txt}>{item.thoi_gian}</Text>
                </View>
            </View>
        );
    }, [data, onChangeStatus, toggle]);

    const keyExtractor = useCallback((item: any, index: number) => `${index}${item.id}`, []);

    const renderFooter = useMemo(() => <View>
        {canLoadMoreUI && <MyLoading isOverview={false} />}
    </View>, [canLoadMoreUI]);

    const onRefresh = useCallback(() => {
        condition.current.offset = 0;
        condition.current.canLoadMore = true;
        setIsRefreshing(true);
        fetchListStaff();
        setIsRefreshing(false);
    }, [fetchListStaff]);

    const onEndReached = useCallback(() => {
        if (!condition.current.isLoading && condition.current.canLoadMore) {
            fetchListStaff(true);
        }
    }, [fetchListStaff]);

    const renderEmptyData = useMemo(() => (<EmptyComponent />), []);

    const renderEmpty = useMemo(() => (data?.length === 0 && !canLoadMoreUI) ? renderEmptyData : null, [canLoadMoreUI, data?.length, renderEmptyData]);

    const onPopupStaff = useCallback(() => {
        refPopup?.current?.show();
    }, []);

    const onAddStaff = useCallback(async (name?: string, phone?: string) => {
        if (name && phone) {
            setLoading(true);
            const resStaff = await apiServices.groupManagerServices.createStaff(name, phone);
            setLoading(false);
            if (resStaff.success && resStaff.data) {
                const msg = resStaff.data as MessageModel;
                ToastUtils.showSuccessToast(msg.message);
                condition.current.offset = 0;
                fetchListStaff();
            }
        }
    }, [apiServices.groupManagerServices, fetchListStaff]);

    const renderFlatList = useMemo(() => (
        <View style={styles.body} >
            <MyFlatList
                style={styles.flatListContent}
                data={data}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                ListFooterComponent={renderFooter}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                onEndReached={onEndReached}
                ListEmptyComponent={renderEmpty}
                onEndReachedThreshold={0.01}
            />
            <Touchable style={styles.tob} onPress={onPopupStaff}>
                <Text style={styles.textTob}>{Languages.groupManager.addStaff}</Text>
            </Touchable>
        </View>
    ), [data, isRefreshing, keyExtractor, onEndReached, onPopupStaff, onRefresh, renderEmpty, renderFooter, renderItem]);
    return (
        <ImageBackground style={styles.container} source={BackGround} resizeMode={'cover'}>
            <HeaderBar title={Languages.groupManager.staff} isLowerCase />
            {renderFlatList}
            <PopupAddStaff ref={refPopup} title={Languages.groupManager.addStaff} description={Languages.groupManager.passStaff} onConfirm={onAddStaff} />
            {loading && <MyLoading isOverview />}
        </ImageBackground >
    );
});
export default StaffComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    noData: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: SCREEN_HEIGHT * 0.8
    },
    body: {
        paddingHorizontal: 16,
        paddingVertical: 24,
        flex: 1
    },
    box: {
        ...Styles.shadow,
        flex: 1,
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: COLORS.GRAY_15
    },
    item: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column'
    },
    itemTop: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    itemBottom: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    txt: {
        flex: 1,
        ...Styles.typography.regular,
        color: COLORS.GRAY_13
    },
    txtBold: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_13
    },
    dash: {
        paddingVertical: 5
    },
    textEmpty: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size13,
        textAlign: 'center',
        marginVertical: 20
    },
    flatListContent: {
        paddingVertical: 3,
        paddingHorizontal: 2
    },
    tob: {
        width: '100%',
        padding: 10,
        backgroundColor: COLORS.GREEN,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textTob: {
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size14,
        fontFamily: Configs.FontFamily.medium
    }
});
