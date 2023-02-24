import React, { useCallback } from 'react';

import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import { COLORS, RenderHtmlStyle } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import he from 'he';
import RenderHTML from 'react-native-render-html';
import { ScrollView, View, StyleSheet } from 'react-native';
import { HeaderBar } from '@/components';

const NewsDetail = ({ route }: { route: any }) => {
    const getContent = useCallback(() => {
        const preTags = '<style> img { display: block; width: auto; max-width: 60%; height: auto; margin:auto } </style>';
        return route?.params?.item?.content_vi?.split('cpanel')?.join('lms') + preTags;
    }, [route?.params?.item?.content_vi]);

    const source = `<div style="font-family: '${Configs.FontFamily.regular}'; 
    font-size: ${Configs.FontSize.size13}px; color: ${COLORS.BLACK}; ">
            ${he.decode(getContent() || '')}
          </div>`

    return <View style={styles.mainContainer}>
        <HeaderBar title={route?.params?.uri ? route?.params?.title_vi : route?.params?.item.title_vi} isLowerCase />

        <ScrollView style={styles.scrollContent}>
            <RenderHTML
                contentWidth={SCREEN_WIDTH}
                source={{ html: source }}
                systemFonts={[Configs.FontFamily.regular]}
                enableExperimentalMarginCollapsing={true}
                tagsStyles={RenderHtmlStyle}
            />
        </ScrollView>
    </View>

};

export default NewsDetail;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 5
    }
});
