import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Dash from 'react-native-dash';
import Pie from 'react-native-pie';
import SelectDropdown from 'react-native-select-dropdown';
import { VictoryBar, VictoryChart, VictoryGroup, VictoryLabel, VictoryTheme } from 'victory-native';
import { useIsFocused } from '@react-navigation/native';

import IcDisbursement from '@/assets/images/ic_disbursement.svg';
import IcInsurance from '@/assets/images/ic_insurance.svg';
import IcNoData from '@/assets/images/ic_no_data.svg';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import { Month } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Button, HeaderBar } from '@/components';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import { RateMemberModel, ReportGroupByMonth, ReportGroupByYear, ReportGroupModel } from '@/models/group-manager';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/ScreenUtils';
import Utils from '@/utils/Utils';

const GroupManager = observer(() => {
    const { apiServices } = useAppStore();
    const [dataReportByYear, setDataReportByYear] = useState<ReportGroupByYear[]>([]);
    const [dataReport, setDataReport] = useState<ReportGroupModel>();
    const [dataReportByMonth, setDataReportByMonth] = useState<ReportGroupByMonth>();
    const [dataRateMember, setDataRateMember] = useState<RateMemberModel[]>([]);
    const [arrLabel, setArrLabel] = useState<string[]>([]);
    const [maxY, setMaxY] = useState<Number>(1);
    const [maxYStaff, setMaxYStaff] = useState<Number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [toggle, setToggle] = useState<boolean>(false);
    const isFocus = useIsFocused();

    const offset = useRef<string[]>([]);
    const [totalMember, setTotalMember] = useState<number>();
    const charStaff = useRef<any>({
        month: Number((new Date()).getMonth() + 1),
        offset: 0
    });
    const PAGE_SIZE = 10;

    useEffect(() => {
        if (isFocus) {
            fetchDataReport();
            fetchDataReportByYear();
            fetchTotalMember();
            fetchDataReportByMonth(Number((new Date()).getMonth() + 1));
            fetchDataReportRateMember(Number((new Date()).getMonth() + 1), charStaff.current.offset);
        }
    }, [isFocus]);

    const fetchTotalMember = useCallback(async () => {
        setIsLoading(true);
        const resTotal = await apiServices.groupManagerServices.getTotalMember();
        setIsLoading(false);
        if (resTotal.success) {
            setTotalMember(resTotal.data as number);
            offset.current = [];
            const total = Number(resTotal.data);
            const mod = total % 10;
            const length = mod > 0 ? Math.floor(total / 10) + 1 : Math.floor(total / 10);

            if (length === 0) offset.current.push(`${1}${'-'}${10}}`);

            for (let i = 0; i < length; i++) {
                if (i === 0) {
                    if (length === 1) {
                        offset.current.push(`${1}${'-'}${mod > 0 ? mod : 10}`);
                    } else {
                        offset.current.push(`${1}${'-'}${1 * 10 * (i + 1)}`);
                    }
                } else if (i === length - 1) {
                    if (mod === 0) {
                        offset.current.push(`${1 * 10 * i}${'-'}${1 * 10 * (i + 1)}`);
                    } else {
                        offset.current.push(`${1 * 10 * i}${'-'}${1 * 10 * i + mod}`);
                    }
                } else {
                    offset.current.push(`${1 * 10 * i}${'-'}${1 * 10 * (i + 1)}`);
                }
            }
        }
    }, [apiServices.groupManagerServices]);

    const fetchDataReport = useCallback(async () => {
        setIsLoading(true);
        const resReport = await apiServices.groupManagerServices.getReportGroup();
        setIsLoading(false);
        if (resReport.success) {
            setDataReport(resReport.data as ReportGroupModel);
        }
    }, [apiServices.groupManagerServices]);

    const fetchDataReportByMonth = useCallback(async (month: number) => {
        setIsLoading(true);
        const resReport = await apiServices.groupManagerServices.getReportGroupMonth(month);
        setIsLoading(false);
        if (resReport.success) {
            setDataReportByMonth(resReport.data as ReportGroupByMonth);
        }
    }, [apiServices.groupManagerServices]);

    const fetchDataReportRateMember = useCallback(async (month: Number, offsets: Number) => {
        setIsLoading(true);
        const res = await apiServices.groupManagerServices.getReportRateMember(month, PAGE_SIZE, Number(offsets) * PAGE_SIZE);
        let totalSize = 0;
        setIsLoading(false);
        if (res.success) {
            const _res = res.data as RateMemberModel[];
            totalSize = _res.length || 0;
            if (totalSize > 0) {
                const convert = _res.map((item: RateMemberModel, index: number) => {
                    item.price_bh_month /= 1000000;
                    item.price_bh_month = Math.round(item.price_bh_month * 100) / 100;
                    item.price_giaingan_month /= 1000000;
                    item.price_giaingan_month = Math.round(item.price_giaingan_month * 100) / 100;
                    item.stt = `${index + 1}`;
                    return item;
                });
                setDataRateMember(convert);
                const maxInsStaff = Math.max(..._res.map(user => user.price_bh_month));
                const maxDisStaff = Math.max(..._res.map(user => user.price_giaingan_month));
                setMaxYStaff((maxDisStaff > 0 || maxInsStaff > 0) ? (maxDisStaff > maxInsStaff ? maxDisStaff : maxInsStaff) : 400);
                const arr = [] as string[];
                for (let i = 0; i < _res?.length; i++) {
                    arr.push(_res[i].name);
                }
                setArrLabel(arr);
                setToggle(last => !last);
            }
        }
    }, [apiServices.groupManagerServices]);

    const fetchDataReportByYear = useCallback(async () => {
        setIsLoading(true);
        const resReport = await apiServices.groupManagerServices.getReportGroupYear();
        setIsLoading(false);
        if (resReport.success) {
            const _resReport = resReport.data as any;
            const convert = [] as ReportGroupByYear[];
            Object.keys(_resReport).map((key) => {
                _resReport[key].price_bh_month /= 1000000;
                _resReport[key].price_giaingan_month /= 1000000;
                const _item = _resReport[key] as ReportGroupByYear;
                convert.push(_item);
                return convert;
            });
            const maxIns = Math.max(...convert.map(user => user.price_bh_month));
            const maxDis = Math.max(...convert.map(user => user.price_giaingan_month));
            setMaxY((maxDis > 0 || maxIns > 0) ? (maxDis > maxIns ? maxDis : maxIns) : 400);
            setDataReportByYear(convert);
        }
    }, [apiServices.groupManagerServices]);

    const renderPieChart = useMemo(() => {
        const price_bh = dataReportByMonth?.price_bh_month || 0;
        const price_giaingan = dataReportByMonth?.price_giaingan_month || 0;
        const total = price_bh + price_giaingan;
        const insurance = Math.round((dataReportByMonth?.price_bh_month || 0) / total * 10000) / 100;
        const disbursement = Math.round((dataReportByMonth?.price_giaingan_month || 0) / total * 10000) / 100;
        return (
            <View style={[styles.graphWrapper, styles.box]}>
                <View style={styles.viewPieTop}>
                    <Text style={styles.txtBoldSmall}>{Languages.groupManager.monthlySalesRate}</Text>
                    <SelectDropdown
                        data={Month}
                        onSelect={(selectedItem, index) => {
                            fetchDataReportByMonth(index + 1);
                        }}
                        buttonTextAfterSelection={(selectedItem) => selectedItem}
                        rowTextForSelection={(item) => item}
                        defaultButtonText={`${Number((new Date()).getMonth() + 1)}`}
                        buttonStyle={styles.containerButton}
                        dropdownIconPosition={'right'}
                    />
                </View>
                <Dash style={styles.dash} dashColor={COLORS.GRAY_15} dashGap={5} dashLength={10} dashThickness={1} />
                <View style={styles.viewPie}>
                    {total === 0 ? (
                        <Pie
                            radius={80}
                            innerRadius={60}
                            sections={[
                                {
                                    percentage: 100,
                                    color: COLORS.GRAY
                                }
                            ]}
                            dividerSize={5}
                        />
                    ) : (
                        <>
                            {(insurance === 0 || disbursement === 0) ?
                                (<>
                                    {insurance === 0 ? (
                                        <Pie
                                            radius={80}
                                            innerRadius={60}
                                            sections={[
                                                {
                                                    percentage: disbursement,
                                                    color: COLORS.GREEN
                                                }
                                            ]}
                                            dividerSize={5}
                                        />
                                    ) : (
                                        <Pie
                                            radius={80}
                                            innerRadius={60}
                                            sections={[
                                                {
                                                    percentage: insurance,
                                                    color: COLORS.ORANGE_67
                                                }
                                            ]}
                                            dividerSize={5}
                                        />
                                    )}
                                </>) : (
                                    <Pie
                                        radius={80}
                                        innerRadius={60}
                                        sections={[
                                            {
                                                percentage: insurance,
                                                color: COLORS.ORANGE_67
                                            },
                                            {
                                                percentage: disbursement,
                                                color: COLORS.GREEN
                                            }
                                        ]}
                                        dividerSize={5}
                                    />
                                )
                            }</>
                    )}
                    <Text style={styles.label}>{Utils.formatLoanMoney(`${(total)}`)}</Text>
                </View>
                <View style={styles.viewBottomPie}>
                    <View style={styles.viewSpaceBetween}>
                        <View style={styles.viewRow}>
                            <IcInsurance width={20} height={20} style={styles.icon} />
                            <Text style={styles.txtSmall}>{Languages.groupManager.insurance}</Text>
                        </View>
                        <Text style={[styles.txtSmall, styles.colorOrange]}>{Utils.formatLoanMoney(`${price_bh || 0}`)}</Text>
                        <Text style={[styles.txtSmall, styles.colorOrange]}>{`${insurance || 0}%` || `${0}%`}</Text>
                    </View>
                    <View style={styles.viewSpaceBetween}>
                        <View style={styles.viewRow}>
                            <IcDisbursement width={20} height={20} style={styles.icon} />
                            <Text style={styles.txtSmall}>{Languages.groupManager.disbursement}</Text>
                        </View>
                        <Text style={[styles.txtSmall, styles.colorGreen]}>{Utils.formatLoanMoney(`${price_giaingan || 0}`)}</Text>
                        <Text style={[styles.txtSmall, styles.colorGreen]}>{`${disbursement || 0}%`}</Text>
                    </View>
                </View>
            </View>
        );
    }, [dataReportByMonth?.price_bh_month, dataReportByMonth?.price_giaingan_month, fetchDataReportByMonth]);

    const renderVictoryChartStaff = useMemo(() => (
        <View style={[styles.graphWrapper, styles.box]}>
            <View style={styles.viewPieTop}>
                <Text style={styles.txtBoldSmall}>{Languages.groupManager.salesStaff}</Text>
                <SelectDropdown
                    data={Month}
                    onSelect={(selectedItem, index) => {
                        fetchDataReportRateMember(index + 1, charStaff.current.offset);
                        charStaff.current.month = index + 1;
                    }}
                    buttonTextAfterSelection={(selectedItem) => selectedItem}
                    rowTextForSelection={(item) => item}
                    defaultButtonText={`${Number((new Date()).getMonth() + 1)}`}
                    buttonStyle={styles.containerButton}
                    dropdownIconPosition={'left'}
                />
            </View>

            <View style={styles.viewPieTop}>
                <Text style={styles.txtBoldSmall}>{Languages.groupManager.sttStaff}</Text>
                <SelectDropdown
                    data={offset.current}
                    onSelect={(selectedItem, index) => {
                        fetchDataReportRateMember(charStaff.current.month, index);
                        charStaff.current.offset = index;
                    }}
                    buttonTextAfterSelection={(selectedItem) => selectedItem}
                    rowTextForSelection={(item) => item}
                    defaultButtonText={(totalMember && totalMember < 10) ? `1-${totalMember}` : '1-10'}
                    buttonStyle={styles.containerButton}
                    dropdownIconPosition={'left'}
                    disabled={totalMember === 0}
                />
            </View>
            <Dash
                dashThickness={1}
                dashLength={6}
                dashGap={6}
                dashColor={COLORS.GRAY_16}
            />
            {dataRateMember.length > 0 ? <>
                <VictoryChart
                    width={SCREEN_WIDTH - 30}
                    height={SCREEN_HEIGHT * 0.12 * (Number(dataRateMember?.length) - 1 > 1 ? dataRateMember.length : 2)}
                    horizontal
                    theme={VictoryTheme.material}
                    domainPadding={{ x: 30, y: 5 }}
                >
                    <VictoryGroup
                        offset={22}
                        animate
                        labels={arrLabel}
                        padding={10}
                    >
                        <VictoryGroup
                            domainPadding={{ x: [-22, 0] }}
                            domain={{
                                y: [0, maxYStaff.valueOf() * 2]
                            }}
                            color={COLORS.ORANGE_67}
                        >
                            <VictoryBar
                                data={dataRateMember}
                                x={'stt'}
                                y={'price_bh_month'}
                                colorScale={'green'}
                                animate
                                barWidth={20}
                            />
                        </VictoryGroup>
                        <VictoryGroup
                            domain={{
                                y: [0, maxYStaff.valueOf() * 2]
                            }}
                            color={COLORS.GREEN}
                            domainPadding={{ x: [0, -22] }}
                            labels={arrLabel}
                        >
                            <VictoryBar
                                data={dataRateMember}
                                x={'stt'}
                                y={'price_giaingan_month'}
                                animate
                                barWidth={20}
                            />
                        </VictoryGroup>
                    </VictoryGroup>
                    <VictoryLabel
                        x={SCREEN_WIDTH - 75}
                        y={SCREEN_HEIGHT * 0.12 * (dataRateMember?.length || 3) - 50}
                        text={Languages.groupManager.amountMoney}
                    />
                </VictoryChart>
                <View style={styles.viewTextTop}>
                    <View style={styles.viewRow}>
                        <IcInsurance width={20} height={20} style={styles.icon} />
                        <Text style={styles.txtSmall}>{Languages.groupManager.insurance}</Text>
                    </View>
                    <View style={styles.viewRow}>
                        <IcDisbursement width={20} height={20} style={styles.icon} />
                        <Text style={styles.txtSmall}>{Languages.groupManager.disbursement}</Text>
                    </View>
                </View>
            </> :
                <View style={styles.noData}>
                    <IcNoData />
                    <Text style={[styles.txtBoldSmall, styles.margVertical]}>{Languages.groupManager.noData}</Text>
                </View>}
        </View>
    ), [arrLabel, dataRateMember, fetchDataReportRateMember, maxYStaff, totalMember, toggle]);
    const renderVictoryChart = useMemo(() => (
        <View style={styles.container}>
            <View style={[styles.graphWrapper, styles.box]}>
                <View style={styles.viewPieTop}>
                    <Text style={styles.txtBoldSmall}>{Languages.groupManager.yieldByYear}</Text>
                </View>
                <Dash style={styles.dash} dashColor={COLORS.GRAY_15} dashGap={5} dashLength={10} dashThickness={1} />
                {dataReportByYear.filter(item => item.price_bh_month !== 0 || item.price_giaingan_month !== 0).length > 0 ?
                    <>
                        <VictoryChart
                            width={SCREEN_WIDTH - 30}
                            height={SCREEN_HEIGHT * 0.08 * 12}
                            horizontal
                            theme={VictoryTheme.material}
                            domainPadding={{ x: 30, y: 5 }}
                        >
                            <VictoryGroup
                                offset={22}
                                colorScale={'qualitative'}
                                animate
                                domain={{
                                    y: [0, maxY.valueOf() + 100]
                                }}
                            >
                                <VictoryGroup
                                    domain={{
                                        y: [0, maxY.valueOf() * 2]
                                    }}
                                    color={COLORS.ORANGE_67}
                                    domainPadding={{ x: [0, -22] }}
                                >
                                    <VictoryBar
                                        data={dataReportByYear}
                                        x={'month'}
                                        y={'price_bh_month'}
                                        colorScale={'green'}
                                        barWidth={20}
                                    />
                                </VictoryGroup>
                                <VictoryGroup
                                    domain={{
                                        y: [0, maxY.valueOf() * 2]
                                    }}
                                    color={COLORS.GREEN}
                                    domainPadding={{ x: [-22, 0] }}
                                >
                                    <VictoryBar
                                        data={dataReportByYear}
                                        x={'month'}
                                        y={'price_giaingan_month'}
                                        colorScale={'green'}
                                        barWidth={20}
                                    />
                                </VictoryGroup>

                            </VictoryGroup>
                            <VictoryLabel
                                x={20} y={30}
                                text={Languages.groupManager.month}
                            />
                            <VictoryLabel
                                x={SCREEN_WIDTH - 75}
                                y={SCREEN_HEIGHT * 0.08 * 12 - 50}
                                text={Languages.groupManager.amountMoney}
                            />
                        </VictoryChart>
                        <View style={styles.viewTextTop}>
                            <View style={styles.viewRow}>
                                <IcInsurance width={20} height={20} style={styles.icon} />
                                <Text style={styles.txtSmall}>{Languages.groupManager.insurance}</Text>
                            </View>
                            <View style={styles.viewRow}>
                                <IcDisbursement width={20} height={20} style={styles.icon} />
                                <Text style={styles.txtSmall}>{Languages.groupManager.disbursement}</Text>
                            </View>
                        </View>
                    </> : <View style={styles.noData}>
                        <IcNoData />
                        <Text style={[styles.txtBoldSmall, styles.margVertical]}>{Languages.groupManager.noData}</Text>
                    </View>
                }

            </View>
        </View >
    ), [dataReportByYear, maxY]);

    const onNavigateStaff = useCallback(() => {
        Navigator.pushScreen(ScreenNames.staff);
    }, []);

    const onNavigateProduct = useCallback(() => {
        Navigator.pushScreen(ScreenNames.loanBillingList, { isBack: true });
    }, []);

    const onNavigateBonus = useCallback(() => {
        Navigator.navigateScreen(ScreenNames.bonus);
    }, []);

    return (
        <View style={styles.container}>
            <HeaderBar title={Languages.account.manager} isLowerCase />
            <ScrollView>
                <View style={styles.body}>
                    <View style={styles.viewGroupBox}>
                        <View style={styles.box}>
                            <View style={styles.viewTextTop}>
                                <Text style={styles.txtBig}>{dataReport?.tong_tien_thanh_toan}</Text>
                                <Text style={styles.txtVND}>{Languages.common.vnd}</Text>
                            </View>
                            <Text style={styles.txtSmall}>{Languages.groupManager.paymentAmount}</Text>
                            <View style={styles.viewTextTop}>
                                <View style={styles.txtTopSmall}>
                                    <View style={styles.viewTextTop}>
                                        <Text style={styles.txtBoldSmall}>{dataReport?.tong_hoa_hong}</Text>
                                        <Text style={styles.txtVNDSmall}>{Languages.common.vnd}</Text>
                                    </View>
                                    <Text style={styles.txtSmall}>{Languages.groupManager.bonus}</Text>
                                </View>
                                <View style={styles.txtTopSmall}>
                                    <View style={styles.viewTextTop}>
                                        <Text style={styles.txtBoldSmall}>{dataReport?.san_pham_da_tao_thanh_cong}</Text>
                                    </View>
                                    <Text style={styles.txtSmall}>{Languages.groupManager.successfulProduct}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.viewGroupBox}>
                        <Button
                            buttonContainer={styles.boxSmall}
                            label={Languages.groupManager.staff}
                            textStyle={styles.txtSmall}
                            value={dataReport?.tong_so_thanh_vien?.toString()}
                            textStyleValue={styles.txtBoldSmall}
                            isLowerCase
                            onPress={onNavigateStaff}
                            radius={8}
                        />
                        <Button
                            buttonContainer={styles.boxSmall}
                            label={Languages.groupManager.product}
                            textStyle={styles.txtSmall}
                            value={dataReport?.san_pham_da_tao?.toString()}
                            textStyleValue={styles.txtBoldSmall}
                            onPress={onNavigateProduct}
                            isLowerCase
                            radius={8}
                        />
                    </View>
                    <View style={[styles.viewGroupBox, styles.mgTop]}>
                        {renderPieChart}
                    </View>
                    <View style={styles.viewGroupBox}>
                        {renderVictoryChart}
                    </View>
                    {renderVictoryChartStaff}
                    <Button
                        label={Languages.groupManager.detailBonus}
                        isLowerCase
                        textStyle={styles.txtSmallX}
                        onPress={onNavigateBonus}
                        buttonContainer={styles.button}
                    />
                    {isLoading && <MyLoading isOverview />}
                </View>
            </ScrollView >
        </View>
    );
});

export default GroupManager;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: PADDING_BOTTOM

    },
    mgTop: {
        marginTop: 15
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
    boxSmall: {
        ...Styles.shadow,
        width: '48%',
        padding: 10,
        borderRadius: 10,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.GRAY_15
    },
    viewGroupBox: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    viewTextTop: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    txtBig: {
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size19,
        fontFamily: Configs.FontFamily.medium,
        textAlign: 'center'
    },
    txtTopSmall: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    txtBoldSmall: {
        fontSize: Configs.FontSize.size14,
        fontFamily: Configs.FontFamily.medium,
        textAlign: 'center'
    },

    txtSmall: {
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.regular,
        textAlign: 'center',
        flexDirection: 'column'
    },
    txtSmallX: {
        fontSize: Configs.FontSize.size14,
        fontFamily: Configs.FontFamily.regular,
        textAlign: 'center',
        flexDirection: 'column'
    },
    txtVND: {
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.regular,
        padding: 3
    },
    txtVNDSmall: {
        fontSize: Configs.FontSize.size10,
        fontFamily: Configs.FontFamily.regular,
        padding: 2
    },
    label: {
        position: 'absolute',
        textAlign: 'center',
        fontSize: Configs.FontSize.size14
    },
    graphWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    viewPieTop: {
        padding: 5,
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    containerButton: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.GRAY,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        width: 100,
        height: 40
    },
    button: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.GRAY,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        width: '100%',
        height: 40,
        marginBottom: 25
    },
    textBtn: {
        fontSize: Configs.FontSize.size12,
        color: COLORS.BLACK,
        fontFamily: Configs.FontFamily.regular,
        paddingHorizontal: 10
    },
    dash: {
        color: COLORS.GRAY_16,
        width: '98%',
        marginBottom: 10,
        marginTop: 5
    },
    viewPie: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewBottomPie: {
        paddingHorizontal: 20,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5
    },
    viewRow: {
        flexDirection: 'row',
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    viewSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '120%',
        marginLeft: '10%'
    },
    icon: {
        marginRight: 5
    },
    colorGreen: {
        color: COLORS.GREEN_1,
        flex: 1
    },
    colorOrange: {
        color: COLORS.ORANGE_67,
        flex: 1
    },
    noData: {
        marginVertical: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    margVertical: {
        marginVertical: 10
    }
});
