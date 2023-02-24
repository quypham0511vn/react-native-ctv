// import { BottomSheetModal } from '@gorhom/bottom-sheet';
// import { observer } from 'mobx-react';
// import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
// import HTMLView from 'react-native-htmlview';
// import Dash from 'react-native-dash';
// import FastImage from 'react-native-fast-image';

// import AfterIC from '@/assets/image/ic_identify_after.svg';
// import BeforeIC from '@/assets/image/ic_identify_before.svg';
// import AvatarIC from '@/assets/image/ic_KYC_avatar.svg';
// import WarnIC from '@/assets/image/ic_warn_round_yellow.svg';
// import { ENUM_TYPE_CAMERA, ENUM_TYPE_CARD_CAMERA, noteAvatar, noteKYC, STATE_VERIFY_ACC } from '@/common/constants';
// import Languages from '@/common/Languages';
// import { Button } from '@/components/elements/button';
// import { BUTTON_STYLES } from '@/components/elements/button/constants';
// import { TextFieldActions } from '@/components/elements/textfield/types';
// import { MyTextInput } from '@/components/elements/textfield/index';
// import HeaderBar from '@/components/header';
// import HideKeyboard from '@/components/HideKeyboard';
// import PopupNotifyNoAction from '@/components/PopupNotifyNoAction';
// import { PopupActionTypes } from '@/models/typesPopup';
// import { COLORS, HtmlStyles } from '@/theme';
// import FormValidate from '@/utils/FormValidate';
// import ImageUtils from '@/utils/ImageUtils';
// import { MyStylesAccountIdentify } from './styles';
// import SessionManager from '@/manager/SessionManager';
// import { useAppStore } from '@/hooks';
// import ToastUtils from '@/utils/ToastUtils';
// import { UserInfoModal } from '@/models/user-models';
// import Loading from '@/components/loading';
// import Navigator from '@/routers/Navigator';
// import ScreenName from '@/common/screenNames';

// const AccountIdentifyNew = observer(({ route }: any) => {
//     const { apiServices, userManager } = useAppStore();
//     const isSaveCache = route?.params?.isSaveCache;

//     const styles = MyStylesAccountIdentify();
//     const [identityAcc, setIdentity] = useState<string>(SessionManager.userInfo?.identity || '');
//     const [avatarImg, setAvatar] = useState<string>(userManager.userInfo?.avatar || '');
//     const [frontIdentify, setFrontIdentify] = useState<string>(userManager.userInfo?.front_facing_card || '');
//     const [behindIdentify, setBehindIdentify] = useState<string>(userManager.userInfo?.card_back || '');
//     const [isLoading, setLoading] = useState<boolean>(false);

//     const identifyRef = useRef<TextFieldActions>();
//     const avatarRef = useRef<BottomSheetModal>();
//     const frontIdentifyRef = useRef<BottomSheetModal>();
//     const behindIdentifyRef = useRef<BottomSheetModal>();

//     const popupConfirmRef = useRef<PopupActionTypes>();

//     const onChangeText = useCallback((value?: string) => {
//         setIdentity(value || '');
//     }, []);

//     useEffect(() => {
//         setAvatar(userManager.userInfo?.avatar || '');
//         setFrontIdentify(userManager.userInfo?.front_facing_card || '');
//         setBehindIdentify(userManager.userInfo?.card_back || '');
//     }, [userManager.userInfo?.avatar, userManager.userInfo?.card_back, userManager.userInfo?.front_facing_card]);

//     useEffect(() => {
//         if (SessionManager?.userInfo?.tinh_trang?.status === STATE_VERIFY_ACC.NO_VERIFIED) {
//             if (!isSaveCache) {
//                 userManager.updateUserInfo({
//                     ...userManager.userInfo,
//                     avatar: '',
//                     front_facing_card: '',
//                     card_back: ''
//                 });
//             }
//         }

//     }, [isSaveCache, userManager]);

//     const uploadImage = useCallback(async (file: any) => {
//         const res = await apiServices?.image.uploadImage(
//             {
//                 path: file,
//                 uri: file
//             },
//             Languages.errorMsg.uploading
//         );
//         if (res.success) {
//             const data = res?.data;
//             console.log('data = ', JSON.stringify(data));
//             return {
//                 ...data
//             };
//         }
//         ToastUtils.showErrorToast(Languages.errorMsg.uploadingError);
//         return '';
//     }, [apiServices?.image]);

//     const uploadIdentification = useCallback(async (imgFront: any, imgBehind: any, imgAvatar: any) => {

//         if (imgAvatar && imgFront && imgBehind) {
//             setLoading(true);
//             const res = await apiServices?.auth?.identityVerify(
//                 identityAcc,
//                 imgFront,
//                 imgBehind,
//                 imgAvatar
//             );
//             setLoading(false);
//             if (res.success) {
//                 popupConfirmRef.current?.show();
//                 const resUser = await apiServices.auth.getUserInfo();
//                 if (resUser.success) {
//                     const data = resUser.data as UserInfoModal;
//                     userManager.updateUserInfo({
//                         ...userManager.userInfo,
//                         ...data,
//                         identity: identityAcc,
//                         avatar: avatarImg,
//                         front_facing_card: frontIdentify,
//                         card_back: behindIdentify
//                     });
//                 }
//             }
//         }
//         else {
//             ToastUtils.showErrorToast(Languages.errorMsg.uploadingError);
//         }
//     }, [apiServices.auth, avatarImg, behindIdentify, frontIdentify, identityAcc, userManager]);

//     const getDataUpload = useCallback(
//         async (response: any) => {
//             let imgFront;
//             let imgBehind;
//             let imgAvatar;
//             if (response?.length === 3) {
//                 imgFront = Object.values(response[0]).join('');
//                 imgBehind = Object.values(response[1]).join('');
//                 imgAvatar = Object.values(response[2]).join('');

//                 uploadIdentification(
//                     imgFront,
//                     imgBehind,
//                     imgAvatar);
//             }
//         }, [uploadIdentification]);

//     const uploadKYC = useCallback(() => {
//         Promise.all([
//             uploadImage(frontIdentify),
//             uploadImage(behindIdentify),
//             uploadImage(avatarImg)

//         ]).then((value) => {
//             getDataUpload(value);
//         });

//     }, [avatarImg, behindIdentify, frontIdentify, getDataUpload, uploadImage]);

//     const renderInput = useCallback((ref: any, label: string, value: any, keyboardType?: any, disabled?: boolean, length?: number) => (
//         <View style={styles.wrapInput}>
//             <Text style={styles.labelStyle}>{label}</Text>
//             <MyTextInput
//                 ref={ref}
//                 isPhoneNumber={false}
//                 placeHolder={label}
//                 keyboardType={keyboardType}
//                 value={value}
//                 maxLength={length}
//                 onChangeText={onChangeText}
//                 containerInput={styles.inputStyle}
//                 disabled={disabled}
//             />
//         </View>
//     ), [onChangeText, styles.inputStyle, styles.labelStyle, styles.wrapInput]);

//     const onValidate = useCallback(() => {
//         const errMsgIdentify = FormValidate.cardValidate(identityAcc);
//         identifyRef.current?.setErrorMsg(errMsgIdentify);

//         if (`${errMsgIdentify}`.length === 0) {
//             return true;
//         } return false;
//     }, [identityAcc]);

//     const onBackDrop = useCallback(() => {
//         popupConfirmRef.current?.hide();
//         setTimeout(() => { Navigator.goBack(); }, 600);
//     }, []);

//     const renderPopupConfirm = useCallback((ref?: any) => <PopupNotifyNoAction
//         ref={ref}
//         renderIcon={<WarnIC />}
//         renderTitle={Languages.accountIdentify.waitVerify}
//         renderContent={Languages.accountIdentify.waitVerifyContent}
//         onBackdropPress={onBackDrop}
//     />, [onBackDrop]);

//     const onVerify = useCallback(async () => {
//         if (onValidate() && avatarImg && frontIdentify && behindIdentify) {
//             uploadKYC();
//         }
//         else {
//             ToastUtils.showMsgToast(Languages.errorMsg.errEmptyIdentity);
//         }
//     }, [avatarImg, behindIdentify, frontIdentify, onValidate, uploadKYC]);

//     const renderOpenCamera = useCallback((ref: any,
//         onPress: any,
//         label: string,
//         image: any,
//         icon: any,
//         hasDash?: boolean
//     ) => (
//         <>
//             <TouchableOpacity
//                 onPress={onPress}
//                 disabled={SessionManager?.userInfo?.tinh_trang?.status !== STATE_VERIFY_ACC.NO_VERIFIED}
//                 ref={ref}
//                 style={styles.wrapItemPhoto}
//             >
//                 <Text style={styles.identifyTextStyle}>{label}</Text>
//                 {image ? (
//                     <FastImage style={styles.image}
//                         source={{ uri: `${image}` }}
//                         resizeMode={FastImage.resizeMode.cover}
//                     />
//                 ) : (
//                     icon
//                 )}
//             </TouchableOpacity>
//             {!hasDash && <Dash
//                 dashThickness={1}
//                 dashLength={10}
//                 dashGap={5}
//                 dashColor={COLORS.GRAY_13}
//             />}
//         </>
//     ), [styles.identifyTextStyle, styles.image, styles.wrapItemPhoto]);

//     const onPressItemFrontPhotos = useCallback(() => {
//         const navigateScreen = () => {
//             Navigator.pushScreen(ScreenName.accountDetect, {
//                 typeCamera: ENUM_TYPE_CAMERA.CARD,
//                 typeCard: ENUM_TYPE_CARD_CAMERA.FRONT
//             });
//         };
//         ImageUtils.openDetectScreen(navigateScreen);
//     }, []);

//     const onPressItemBehindPhoto = useCallback(() => {
//         const navigateScreen = () => {
//             Navigator.pushScreen(ScreenName.accountDetect,
//                 {
//                     typeCamera: ENUM_TYPE_CAMERA.CARD,
//                     typeCard: ENUM_TYPE_CARD_CAMERA.BACK
//                 });
//         };
//         ImageUtils.openDetectScreen(navigateScreen);
//     }, []);

//     const onPressItemAvatar = useCallback(() => {
//         const navigateScreen = () => {
//             Navigator.pushScreen(ScreenName.accountDetect, {
//                 typeCamera: ENUM_TYPE_CAMERA.FACE
//             });
//         };
//         ImageUtils.openDetectScreen(navigateScreen);
//     }, []);


//     const renderPhoto = useMemo(() => (
//         <HideKeyboard>
//             <View style={styles.contentContainer}>
//                 <Text style={styles.titlePhoto}>{Languages.accountIdentify.imageIdentify}</Text>
//                 <Text style={styles.txtNotePhoto}>{noteKYC[0]}</Text>
//                 <Text style={styles.txtNotePhoto}>{noteKYC[1]}</Text>
//                 {renderOpenCamera(
//                     frontIdentifyRef,
//                     onPressItemFrontPhotos,
//                     Languages.accountIdentify.frontKYC,
//                     frontIdentify,
//                     <BeforeIC />
//                 )}
//                 {renderOpenCamera(
//                     behindIdentifyRef,
//                     onPressItemBehindPhoto,
//                     Languages.accountIdentify.behindKYC,
//                     behindIdentify,
//                     <AfterIC />
//                 )}
//                 <Text style={styles.titlePhoto}>{Languages.accountIdentify.avatarPhoto}</Text>
//                 <Text style={styles.txtNotePhoto}>{noteAvatar[0]}</Text>
//                 <Text style={styles.txtNotePhoto}>{noteAvatar[1]}</Text>
//                 {renderOpenCamera(
//                     avatarRef,
//                     onPressItemAvatar,
//                     Languages.accountIdentify.avatarPhoto,
//                     avatarImg,
//                     <AvatarIC />,
//                     true
//                 )}
//             </View>

//         </HideKeyboard>
//     ), [avatarImg, behindIdentify, frontIdentify, onPressItemAvatar, onPressItemBehindPhoto, onPressItemFrontPhotos, renderOpenCamera, styles.contentContainer, styles.titlePhoto, styles.txtNotePhoto]);

//     const renderTop = useMemo(() => (
//         <HTMLView
//             value={Languages.accountIdentify.noteTopIdentify}
//             stylesheet={HtmlStyles || undefined}
//         />
//     ), []);

//     const renderBottom = useMemo(() => (
//         <>
//             <HTMLView
//                 value={Languages.accountIdentify.note}
//                 stylesheet={HtmlStyles || undefined}
//             />
//             <Button
//                 style={styles.accuracyWrap}
//                 onPress={onVerify}
//                 label={Languages.accountIdentify.confirmKYC}
//                 buttonStyle={BUTTON_STYLES.GREEN_1}
//                 isLowerCase />
//         </>
//     ), [onVerify, styles.accuracyWrap]);

//     return (
//         <View style={styles.container}>
//             <HeaderBar isLight={false} title={Languages.accountIdentify.accountIdentify} hasBack />
//             <ScrollView style={styles.wrapAll}>

//                 {SessionManager.userInfo?.tinh_trang?.status === STATE_VERIFY_ACC.VERIFIED && renderTop}
//                 {renderInput(identifyRef, Languages.accountIdentify.KYC, SessionManager.userInfo?.identity, 'NUMBER', !!SessionManager.userInfo?.identity, 12)}
//                 {renderPhoto}
//                 {SessionManager?.userInfo?.tinh_trang?.status === STATE_VERIFY_ACC.NO_VERIFIED && renderBottom}
//                 {renderPopupConfirm(popupConfirmRef)}
//                 {isLoading && <Loading isOverview />}
//             </ScrollView>
//         </View >

//     );
// });

// export default AccountIdentifyNew;
