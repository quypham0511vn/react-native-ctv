import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';

import BackGround from '@/assets/images/bg.jpg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar } from '@/components';
import MyFlatList from '@/components/MyFlatList';
import { useAppStore } from '@/hooks';
import { BonusGroupModel } from '@/models/group-manager';
import { COLORS, HtmlStyles, Styles } from '@/theme';
import MyLoading from '@/components/MyLoading';
import { TYPE_STATUS_STAFF } from '@/commons/constants';
import EmptyComponent from '@/components/EmptyComponent';

const BonusComponent = observer(() => {
    const { apiServices } = useAppStore();
    const [data, setData] = useState<BonusGroupModel[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    useEffect(() => {
        fetchBonus();
    }, []);

    const convertTime = useCallback((time: string) => {
        const convert = time.split('-').reverse().join('/');
        return convert;
    }, []);

    const fetchBonus = useCallback(async () => {
        setIsLoading(true);
        const res = await apiServices.groupManagerServices.getListBonus();
        setIsLoading(false);
        if (res.success) {
            const _data = res.data as BonusGroupModel[];
            const convert = _data.map((item) => {
                item.end_date = convertTime(item.end_date);
                item.start_date = convertTime(item.start_date);
                return item;
            });
            console.log('convert ===', convert);
            setData(convert);

        }
    }, [apiServices.groupManagerServices, convertTime]);


    const keyExtractor = useCallback((item: any, index: number) => `${index}${item.id}`, []);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchBonus();
        setIsRefreshing(false);
    }, [fetchBonus]);

    const renderItemChild = useCallback(({ item }: any) => (
        <View style={styles.box} >
            <Text style={styles.txt}>{item.name}</Text>
            <Text style={styles.txtBold}>{`${item.percent}%`}</Text>
        </View>
    ), []);

    const renderEmptyData = useMemo(() => (<EmptyComponent />), []);

    const renderEmpty = useMemo(() => (data?.length === 0 && !isLoading) ? renderEmptyData : null, [isLoading, data?.length, renderEmptyData]);

    const renderItem = useCallback((item: any) => {

        const status = item.item.status === TYPE_STATUS_STAFF.ACTIVE ? Languages.groupManager.active : Languages.groupManager.notActive;

        return (
            <View style={styles.item}>
                <View style={styles.itemTop}>
                    <Text style={styles.titleCommission}>{item.item.title_commission}</Text>
                    <View style={styles.styleBar} />
                </View>
                <HTMLView
                    value={`${'<a>'}${Languages.groupManager.startTime}${item.item.start_date}${Languages.groupManager.endTime}${item.item.end_date}${Languages.groupManager.status}${'<g>'}${status}${'</g>'}${'</a>'}`}
                    stylesheet={HtmlStyles || undefined} />
                {item.item.product_list &&
                    <MyFlatList
                        style={styles.flatListContent}
                        data={item.item.product_list}
                        renderItem={renderItemChild}
                        keyExtractor={keyExtractor}
                    />
                }
            </View>
        );
    }, [keyExtractor, renderItemChild]);

    const renderFlatList = useMemo(() => (
        <View style={styles.body}>
            <MyFlatList
                style={styles.flatListContent}
                data={data}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={renderEmpty}
            />
        </View>
    ), [data, isRefreshing, keyExtractor, onRefresh, renderEmpty, renderItem]);

    return (
        <ImageBackground style={styles.container} source={BackGround} resizeMode={'cover'}>
            <HeaderBar title={Languages.groupManager.bonus} isLowerCase />
            {renderFlatList}
            {isLoading && <MyLoading isOverview />}
        </ImageBackground >
    );
}
);
export default BonusComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        paddingHorizontal: 16,
        paddingTop: 24,
        marginBottom: 100
    },
    box: {
        ...Styles.shadow,
        flex: 1,
        padding: 10,
        borderRadius: 10,
        justifyContent: 'space-between',
        marginTop: 15,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: COLORS.GRAY_15
    },
    item: {
        flex: 1,
        flexDirection: 'column',
        marginBottom: 15
    },
    itemTop: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 4
    },
    txt: {
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.regular,
        color: COLORS.GRAY_13
    },
    txtBold: {
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.RED_2
    },
    dash: {
        paddingVertical: 5
    },
    colorGreen: {
        color: COLORS.GREEN_2
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
    titleCommission: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_17,
        paddingRight: 12
    },
    styleBar: {
        borderTopWidth: 1,
        borderTopColor: COLORS.GRAY_16,
        flex: 1
    }
});
