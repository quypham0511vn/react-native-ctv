import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { COLORS, Styles } from '@/theme';
import Utils from '@/utils/Utils';
import { CONTACT, LINKS } from '@/api/constants';
import { Touchable } from './elements/touchable';
import LocationIcon from '@/assets/images/ic_website.svg';
import PhoneIcon from '@/assets/images/ic_phone.svg';
import Languages from '@/commons/Languages';
import { PADDING_BOTTOM } from '@/commons/Configs';

const FooterItem = () => {
    const onCallVfc = useCallback(() => {
        Utils.callNumber(CONTACT.PHONE);
    }, []);

    const onRedirectWebsite = useCallback(() => {
        Utils.openURL(LINKS.WEB);
    }, []);

    const renderFooterItem = useCallback((icon?: any, title?: string, style?: any, onPress?: any) => (
        <Touchable style={style} onPress={onPress}>
            <View style={styles.icon}>{icon}</View>
            <Text style={styles.txtFooter}>{title}</Text>
        </Touchable>
    ), []);

    return <View style={styles.wrapFooter}>
        {renderFooterItem(
            <LocationIcon width={15} height={15} />,
            Languages.authentication.company,
            styles.footerItem,
            onRedirectWebsite
        )}
        {renderFooterItem(
            <PhoneIcon width={15} height={15} />,
            Languages.authentication.switchboard,
            styles.footerItem,
            onCallVfc
        )}
    </View>;

};

export default FooterItem;
const styles = StyleSheet.create({
    footerItem: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    wrapFooter: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
        paddingBottom: PADDING_BOTTOM + 10
    },
    txtFooter: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_13,
        marginLeft: 5
    },
    icon: {
        justifyContent: 'center'
    }
});
