import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { observer } from 'mobx-react';

import { COLORS, Styles } from '@/theme';
import { Configs } from '@/commons/Configs';
import IcEmpty from '@/assets/images/ic_empty_data.svg';
import Languages from '@/commons/Languages';

const EmptyComponent = observer(({ img, description }: { img?: any, description?: string }) => (
    <View style={styles.container}>
        {img || <IcEmpty />}
        <Text style={styles.description}>{description || Languages.errorMsg.emptyList}</Text>
    </View>
));

export default EmptyComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.TRANSPARENT,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24
    },
    description: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size14,
        color: COLORS.GRAY_17,
        paddingTop: 24,
        textAlign: 'center'
    }
});
