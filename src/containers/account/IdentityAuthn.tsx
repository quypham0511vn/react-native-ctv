import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';

import IcAvatarKyc from '@/assets/images/ic_avatar_kyc.svg';
import IcBehindCard from '@/assets/images/ic_behind_card.svg';
import IcFrontCard from '@/assets/images/ic_front_card.svg';
import IcReChoose from '@/assets/images/ic_re_choose_img.svg';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import { noteAvatar, noteKYC, STATE_AUTH_ACC } from '@/commons/constants';
import Languages from '@/commons/Languages';
import { Button, HeaderBar, Touchable } from '@/components';
import { MyImageView } from '@/components/image';
import MyLoading from '@/components/MyLoading';
import { PopupActions } from '@/components/popup/types';
import PopupUploadImage from '@/components/PopupUploadImage';
import { useAppStore } from '@/hooks';
import { ImageFile } from '@/models/image-file';
import { UserInfoModel } from '@/models/user-model';
import { COLORS, HtmlStylesSeen, Styles } from '@/theme';
import ToastUtils from '@/utils/ToastUtils';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/ScreenUtils';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import BackgroundTienNgay from '@/components/BackgroundTienNgay';
import SessionManager from '@/managers/SessionManager';
import Navigator from '@/routers/Navigator';

const IdentityAuthn = observer(() => {
    const { userManager, apiServices } = useAppStore();
    const isFocused = useIsFocused();

    const [imageAvatar, setImageAvatar] = useState<any>();
    const [imageFrontCard, setImageFrontCard] = useState<any>();
    const [imageBehindCard, setImageBehindCard] = useState<any>();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [toggle, setToggle] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfoModel | undefined>(SessionManager.userInfo);
    const popupAvatarImageRef = useRef<PopupActions>(null);
    const popupFrontCardImageRef = useRef<PopupActions>(null);
    const popupBehindCardImageRef = useRef<PopupActions>(null);
    const arrImage = useRef({
        avatar: '',
        frontCard: '',
        behindCard: ''
    });
    const [blur, setBlur] = useState({
        avatar: false,
        frontCard: false,
        behindCard: false
    });

    useEffect(() => {
        if (isFocused) {
            onRefresh();
        }
    }, [isFocused]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        const resUser = await apiServices.auth.getUserInfo();
        setRefreshing(false);
        if (resUser.success) {
            const dataUser = resUser.data as UserInfoModel;
            SessionManager.setUserInfo({
                ...userManager.userInfo,
                ...dataUser
            });
            setUserInfo({ ...userManager.userInfo, ...dataUser });
            setImageAvatar(undefined);
            setImageBehindCard(undefined);
            setImageFrontCard(undefined);
            if (dataUser.status_verified === STATE_AUTH_ACC.RE_VERIFIED) {
                setBlur(last => {
                    last.avatar = true;
                    last.behindCard = true;
                    last.frontCard = true;
                    return last;
                });
                setToggle(last => !last);
            }
        }
    }, [apiServices.auth, userManager.userInfo]);

    const renderTopNotification = useMemo(() => (
        <>
            {userInfo?.status_verified === STATE_AUTH_ACC.RE_VERIFIED &&
                <Text style={styles.textErrorEKyc}>
                    {Languages.errorMsg.failEkyc}
                </Text>}
            {userInfo?.status_verified === STATE_AUTH_ACC.WAIT &&
                <Text style={styles.textLoadingEKyc}>
                    {Languages.errorMsg.loadingEkyc}
                </Text>}
        </>
    ), [userInfo?.status_verified]);

    const renderNoteTypePhoto = useCallback((_title: string, _note1: string, _note2: string) => (
        <View style={styles.noteTypePhotoContainer}>
            <Text style={styles.textTitleNotePhoto}>
                {_title}
            </Text>
            {(!userInfo?.photo && !userInfo?.image_cmt_mattruoc && !userInfo?.image_cmt_matsau) &&
                <>
                    <Text style={styles.textDescribeNotePhoto}>
                        {_note1}
                    </Text>
                    <Text style={styles.textDescribeNotePhoto}>
                        {_note2}
                    </Text>
                </>
            }
        </View>
    ), [userInfo?.image_cmt_matsau, userInfo?.image_cmt_mattruoc, userInfo?.photo]);

    const renderStorePhoto = useCallback((_title: string, _icon: any, _isAvatarImg: boolean, _onPress: any, _imgCache?: any, _imgUploaded?: string, blurImage?: boolean, _disableText?: boolean) => {
        console.log('blur === ', blurImage);
        return (
            <View style={!_isAvatarImg && styles.typePhotoContainer}>
                <View style={styles.titleTypePhotoWrap}>
                    <Text style={styles.textTitleTypePhoto}>
                        {!_disableText && _title}
                    </Text>
                    {userInfo?.status_verified === STATE_AUTH_ACC.RE_VERIFIED || userInfo?.status_verified === STATE_AUTH_ACC.UN_VERIFIED ?
                        <Touchable onPress={_onPress} style={styles.iconReChooseWrap}>
                            <IcReChoose />
                        </Touchable> : null}
                </View>

                <View style={styles.imgWrap} >
                    {_imgCache || _imgUploaded ?
                        <MyImageView
                            style={blurImage ? (_isAvatarImg ? [styles.imageAvatar, styles.blur] : [styles.imageCard, styles.blur]) : (_isAvatarImg ? styles.imageAvatar : styles.imageCard)}
                            imageUrl={_imgCache || _imgUploaded}
                            underlayColor={COLORS.TRANSPARENT}
                        />
                        :
                        <Touchable onPress={_onPress}>
                            {_icon}
                        </Touchable>
                    }
                </View>
            </View>
        );
    }, [userInfo?.status_verified, toggle]);

    const openPopupAvatarCapture = useCallback(() => {
        popupAvatarImageRef.current?.show();
    }, []);

    const openPopupFrontCardCapture = useCallback(() => {
        popupFrontCardImageRef.current?.show();
    }, []);

    const openPopupBehindCardCapture = useCallback(() => {
        popupBehindCardImageRef.current?.show();
    }, []);

    const onImageAvatarSelected = useCallback((_data: ImageFile) => {
        setImageAvatar(_data?.images?.[0]?.path);
        fetchPathImageBeforeUpload(_data?.images?.[0]?.path, 3);
    }, []);

    const onImageFrontSelected = useCallback((_data: ImageFile) => {
        setImageFrontCard(_data?.images?.[0]?.path);
        fetchPathImageBeforeUpload(_data?.images?.[0]?.path, 1);
    }, []);

    const onImageBehindSelected = useCallback((_data: ImageFile) => {
        setImageBehindCard(_data?.images?.[0]?.path);
        fetchPathImageBeforeUpload(_data?.images?.[0]?.path, 2);
    }, []);

    const renderPopupChooseTypeImage = useCallback((_ref: any, _onTypeImageSelect: any, useFrontCamera?: boolean) => (
        <PopupUploadImage
            ref={_ref}
            onImageSelected={_onTypeImageSelect}
            maxSelect={1}
            useFrontCamera={useFrontCamera}
        />
    ), []);

    const fetchPathImageBeforeUpload = useCallback(async (_typeImage: string, index: number) => {
        const getResPath = await apiServices.imageServices.uploadImage(_typeImage);
        if (getResPath.success) {
            const data = getResPath?.data?.path as string;
            switch (index) {
                case 1:
                    arrImage.current.frontCard = data;
                    setBlur(last => {
                        last.frontCard = false;
                        return last;
                    });
                    setToggle(last => !last);
                    return;
                case 2:
                    arrImage.current.behindCard = data;
                    setBlur(last => {
                        last.behindCard = false;
                        return last;
                    });
                    setToggle(last => !last);
                    return;
                default:
                    arrImage.current.avatar = data;
                    setBlur(last => {
                        last.avatar = false;
                        return last;
                    });
                    setToggle(last => !last);
            }
        }
    }, [apiServices.imageServices]);

    const fetchUploadKyc = useCallback(async (_imgFront?: string, _imgBehind?: string, _imgPortrait?: string) => {
        if (_imgFront && _imgBehind && _imgPortrait) {
            setLoading(true);
            const res = await apiServices?.auth?.uploadIdentity(_imgFront, _imgBehind, _imgPortrait);
            setLoading(false);
            if (res.success) {
                onRefresh();
                ToastUtils.showSuccessToast(Languages.eKyc.successUploadImage);
                Navigator.goBack();
            }
        } else {
            ToastUtils.showErrorToast(Languages.errorMsg.enoughEKyc);
        }
    }, [apiServices?.auth, onRefresh]);

    const onConfirmUpLoad = useCallback(async () => {
        if (imageBehindCard && imageFrontCard && imageAvatar) {
            fetchUploadKyc(arrImage.current.frontCard, arrImage.current.behindCard, arrImage.current.avatar);
        } else if (userInfo?.status_verified === STATE_AUTH_ACC.RE_VERIFIED) {
            ToastUtils.showErrorToast(Languages.errorMsg.errNotSendOldEKyc);
        } else {
            ToastUtils.showErrorToast(Languages.errorMsg.enoughEKyc);
        }
    }, [imageBehindCard, imageFrontCard, imageAvatar, userInfo?.status_verified, fetchUploadKyc]);

    const renderBottom = useMemo(() => (
        <View style={styles.bottomContainer}>
            {userInfo?.status_verified === STATE_AUTH_ACC.RE_VERIFIED || userInfo?.status_verified === STATE_AUTH_ACC.UN_VERIFIED ?
                <>
                    <HTMLView
                        value={Languages.eKyc.noteEKyc}
                        stylesheet={HtmlStylesSeen}
                    />
                    <Button label={Languages.eKyc.confirmDocument}
                        buttonStyle={BUTTON_STYLES.GREEN}
                        onPress={onConfirmUpLoad}
                        isLowerCase
                        style={styles.buttonConfirmDocumentWrap}
                    />
                </> : null
            }
        </View>
    ), [onConfirmUpLoad, userInfo?.status_verified]);

    const renderBody = useMemo(() => (
        <>
            {renderNoteTypePhoto(Languages.eKyc.imageKyc, noteKYC[0], noteKYC[1])}
            {renderStorePhoto(Languages.eKyc.frontKyc, <IcFrontCard />, false, openPopupFrontCardCapture, imageFrontCard, userInfo?.image_cmt_mattruoc, blur.frontCard)}
            {renderStorePhoto(Languages.eKyc.behindKyc, <IcBehindCard />, false, openPopupBehindCardCapture, imageBehindCard, userInfo?.image_cmt_matsau, blur.behindCard)}
            {renderNoteTypePhoto(Languages.eKyc.avatarImageKyc, noteAvatar[0], noteAvatar[1])}
            {renderStorePhoto(Languages.eKyc.avatarKyc, <IcAvatarKyc />, true, openPopupAvatarCapture, imageAvatar, userInfo?.photo, blur.avatar, !!userInfo?.photo)}
        </>
    ), [blur.avatar, blur.behindCard, blur.frontCard, imageAvatar, imageBehindCard, imageFrontCard, openPopupAvatarCapture, openPopupBehindCardCapture, openPopupFrontCardCapture, renderNoteTypePhoto, renderStorePhoto, userInfo?.image_cmt_matsau, userInfo?.image_cmt_mattruoc, userInfo?.photo]);

    return (
        <BackgroundTienNgay >
            <HeaderBar title={Languages.eKyc.accountAuthn} isLowerCase />

            <ScrollView style={styles.mainContainer} showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {renderTopNotification}
                {renderBody}
                {renderBottom}
            </ScrollView>
            {renderPopupChooseTypeImage(popupAvatarImageRef, onImageAvatarSelected, true)}
            {renderPopupChooseTypeImage(popupFrontCardImageRef, onImageFrontSelected)}
            {renderPopupChooseTypeImage(popupBehindCardImageRef, onImageBehindSelected)}
            {isLoading && <MyLoading isOverview />}
        </BackgroundTienNgay>
    );
});

export default IdentityAuthn;

const styles = StyleSheet.create({
    mainContainer: {
        paddingHorizontal: 16
    },
    textTitleNotePhoto: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_13
    },
    textDescribeNotePhoto: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        color: COLORS.GRAY_12,
        paddingTop: 4
    },
    textTitleTypePhoto: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_7,
        paddingLeft: 14
    },
    textErrorEKyc: {
        ...Styles.typography.medium,
        color: COLORS.RED_2,
        paddingTop: 16
    },
    textLoadingEKyc: {
        ...Styles.typography.medium,
        color: COLORS.YELLOW_2,
        paddingTop: 16
    },
    typePhotoContainer: {
        borderBottomWidth: 1,
        borderColor: COLORS.GRAY_14
    },
    noteTypePhotoContainer: {
        paddingTop: 16,
        paddingBottom: 8
    },
    titleTypePhotoWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 8
    },
    iconReChooseWrap: {
        marginRight: 12,
        width: 30,
        height: 30,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonConfirmDocumentWrap: {
        marginVertical: 16
    },
    imgWrap: {
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 8
    },
    bottomContainer: {
        paddingTop: 40,
        paddingBottom: PADDING_BOTTOM
    },
    imageAvatar: {
        width: SCREEN_WIDTH * 0.65,
        height: SCREEN_HEIGHT * 0.35,
        borderRadius: 8
    },
    imageCard: {
        width: SCREEN_WIDTH * 0.65,
        height: SCREEN_HEIGHT * 0.16,
        borderRadius: 8
    },

    blur: {
        opacity: 0.5
    }
});

