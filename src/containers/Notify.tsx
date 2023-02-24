import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import IcCard from '@/assets/images/ic_card.svg';
import { Configs, PADDING_BOTTOM, PAGE_SIZE } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar } from '@/components';
import MyFlatList from '@/components/MyFlatList';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import { NotificationModel } from '@/models/notification';
import DateUtils from '@/utils/DateUtils';
import { COLORS, Styles } from '../theme';
import EmptyComponent from '@/components/EmptyComponent';


// [TODO] tab in notification dont implement in this phase
const Notify = observer(() => {

    const { apiServices } = useAppStore();

    const [notifications, setNotifications] = useState<NotificationModel[]>([]);

    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [canLoadMore, setLoadMore] = useState<boolean>(true);
    const [lastId, setLastId] = useState<number>(0);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true);
    const pageSize = PAGE_SIZE;

    const fetchData = useCallback(async (isLoadMore?: boolean) => {
        // const res = await apiServices.notification.getNotifications(isLoadMore ? lastId : 0, pageSize);

        // const newNotifications = res.data as NotificationModel[];

        // if (newNotifications?.length > 0) {
        //     setLastId(last => last + newNotifications.length);

        //     if (isLoadMore) {
        //         setNotifications(last => [...last, ...newNotifications]);
        //     } else {
        //         setNotifications(newNotifications);
        //     }
        // }
        // setLoadMore(newNotifications?.length >= pageSize);
        // setLoadMore(false);
    }, []);

    // useEffect(() => {
    //     fetchData();
    // }, []);

    const keyExtractor = useCallback((item: NotificationModel) => `${item._id.$oid}`, []);

    const renderListNotify = useCallback(({ item }: { item: NotificationModel }) => (
        <View style={styles.itemNotify}>
            <View style={item.status === 0 ? styles.opacity1 : styles.opacity}>
                <TouchableOpacity>
                    <View style={styles.topItem}>
                        <IcCard />
                        <Text style={styles.textTitle}>{Languages.notify.types[0]}</Text>
                        <Text style={styles.textTime}>{DateUtils.formatDatePicker(item.created_at)}</Text>
                    </View>
                    <View style={styles.botTomItem}>
                        <Text style={styles.textHead}>{item.note}</Text>
                        <Text style={styles.description}>{item.message}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View >
    ), []);

    const renderEmptyData = useMemo(() => (<EmptyComponent />), []);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchData();
        setIsRefreshing(false);
    }, [fetchData]);

    const renderFooter = useMemo(() => <View>
        {canLoadMore && <MyLoading isOverview={false} />}
    </View>, [canLoadMore]);

    const renderEmpty = useMemo(() => renderEmptyData, [renderEmptyData]);

    const onMomentumScrollBegin = useCallback(() => {
        setOnEndReachedCalledDuringMomentum(false);
    }, []);

    const onEndReached = useCallback(() => {
        if (!onEndReachedCalledDuringMomentum && canLoadMore) {
            setOnEndReachedCalledDuringMomentum(true);
            fetchData(true);
        }
    }, [canLoadMore, fetchData, onEndReachedCalledDuringMomentum]);

    const renderList = useMemo(() => <MyFlatList
        contentContainerStyle={styles.content}
        data={notifications}
        renderItem={renderListNotify}
        showsHorizontalScrollIndicator={false}
        // ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        // onEndReached={onEndReached}
        // onMomentumScrollBegin={onMomentumScrollBegin}
        // onEndReachedThreshold={0.01}
        {... { keyExtractor }}
    />, [notifications, renderListNotify, renderEmpty, isRefreshing, onRefresh, keyExtractor]);

    return (
        <View style={styles.container}>
            <HeaderBar title={Languages.notify.title} isLowerCase />
            {renderList}
        </View>
    );
});

export default Notify;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: PADDING_BOTTOM
    },
    opacity: {
        opacity: 0.5
    },
    opacity1: {
    },
    itemNotify: {
        ...Styles.shadow,
        marginBottom: 10,
        backgroundColor: COLORS.GRAY_3,
        paddingHorizontal: 10,
        paddingTop: 10,
        paddingBottom: 5,
        borderRadius: 10,
        flex: 1
    },
    botTomItem: {
        marginVertical: 5
    },
    textHead: {
        ...Styles.typography.medium,
        color: COLORS.DARK_GREEN,
        fontSize: Configs.FontSize.size13
    },
    description: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size13,
        marginTop: 10,
        color: COLORS.DARK_GREEN
    },
    topItem: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GRAY_2,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size12,
        flex: 1,
        marginLeft: 10,
        color: COLORS.GRAY_1,
        textTransform: 'uppercase'
    },
    textTime: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size11
    },
    textEmpty: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size13,
        textAlign: 'center',
        marginVertical: 20
    }
});
