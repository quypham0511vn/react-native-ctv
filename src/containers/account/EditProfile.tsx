import { observer } from 'mobx-react';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import IcCalendar from '@/assets/images/ic_black_calendar.svg';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar, Touchable } from '@/components';
import { BUTTON_STYLES } from '@/components/elements/button/constants';
import { Button } from '@/components/elements/button/index';
import { MyTextInput } from '@/components/elements/textfield/index';
import { TextFieldActions, TypeCapitalized, TypeKeyBoard } from '@/components/elements/textfield/types';
import { MyImageView } from '@/components/image';
import ScrollViewWithKeyboard from '@/components/KeyboardAwareView';
import MyDatePicker, { MyDatePickerActions } from '@/components/MyDatePicker';
import MyLoading from '@/components/MyLoading';
import { PopupActions } from '@/components/popup/types';
import PopupUploadImage from '@/components/PopupUploadImage';
import { useAppStore } from '@/hooks';
import { UserInfoModel } from '@/models/user-model';
import FormValidate from '@/utils/FormValidate';
import { COLORS, Styles } from '../../theme';
import BackgroundTienNgay from '@/components/BackgroundTienNgay';
import PickerBottomBase, { ItemPickerProps } from '@/components/PickerBottomBase';
import { PickerAction } from '@/components/PickerValuation';
import { GenderArray } from '../home/mocks/data';
import HideKeyboard from '@/components/HideKeyboard';
import ToastUtils from '@/utils/ToastUtils';
import DateUtils from '@/utils/DateUtils';
import Utils from '@/utils/Utils';
import Navigator from '@/routers/Navigator';
import SessionManager from '@/managers/SessionManager';
import { STATE_AUTH_ACC, TYPE_FORM_ACCOUNT, TYPE_TYPE_ACCOUNT } from '@/commons/constants';

const EditProfile = observer(() => {

    const { apiServices, userManager } = useAppStore();
    const [userInfo] = useState<UserInfoModel | undefined>(SessionManager.userInfo);

    const [imageAvatar, setImageAvatar] = useState<any>();
    const [username, setUsername] = useState<string>(userInfo?.ctv_name || '');
    const [company, setCompany] = useState<string>(userInfo?.ctv_company || '');
    const [emailValue, setEmail] = useState<string>(userInfo?.email || '');
    const [gender, setGender] = useState<string>(userInfo?.ctv_gender || '');
    const [birthDate, setBirthDate] = useState<string>(userInfo?.ctv_DOB || '');

    const [isLoading, setLoading] = useState<boolean>(false);

    const userNameRef = useRef<TextFieldActions>(null);
    const userCompanyRef = useRef<TextFieldActions>(null);

    const emailRef = useRef<TextFieldActions>(null);
    const birthDateRef = useRef<MyDatePickerActions>(null);
    const genderRef = useRef<PickerAction>(null);

    const popupUploadImageRef = useRef<PopupActions>(null);

    const onChangeInput = useCallback((value: string, tag?: string) => {
        console.log('tag ==', value);
        switch (tag) {
            case Languages.editProFile.placename:
                setUsername(value);
                break;
            case Languages.editProFile.placeCompany:
                setCompany(value);
                break;
            case Languages.profileAuth.email:
                setEmail(value);
                break;
            default:
                break;
        }
    }, []);

    const renderInput = useCallback((_title: any, _placeHolder: any, _value: any, _ref: any, onChangeText: any, maxLength?: number, _optional?: boolean, keyboardType?: keyof typeof TypeKeyBoard, _disabled?: boolean, _autoCapitalized?: any) =>
        <MyTextInput
            ref={_ref}
            value={_value}
            label={_title}
            placeHolder={_placeHolder}
            onChangeText={onChangeText}
            maxLength={maxLength || 50}
            optional={_optional}
            keyboardType={keyboardType || 'DEFAULT'}
            stylesContainer={styles.containerInput}
            wrapErrText={styles.wrapErrPickerText}
            containerInput={styles.inputContainer}
            autoCapitalized={_autoCapitalized}
            disabled={_disabled}
        />, []);

    const onValidation = useCallback(() => {
        const errMsgUsername = FormValidate.userNameValidate(username, true);
        const errEmail = FormValidate.emailValidate(emailRef.current?.getValue() || '', true);
        userNameRef.current?.setErrorMsg(errMsgUsername);
        emailRef.current?.setErrorMsg(errEmail);

        if (`${errMsgUsername}${errEmail}`.length === 0) {
            return true;
        }
        return false;
    }, [username]);


    const onPressEdit = useCallback(async () => {
        if (onValidation()) {
            let avatarImage;
            setLoading(true);
            if (imageAvatar) {
                const fetchImage = await apiServices.imageServices.uploadImage(imageAvatar);
                if (fetchImage.success) {
                    const imageHttps = fetchImage?.data?.path as string;
                    avatarImage = imageHttps;
                }
            } else {
                avatarImage = userManager.userInfo?.avatar;
            }
            const uploadAvatar = await apiServices.auth.uploadAvatar(avatarImage || '');
            setLoading(false);
            if (uploadAvatar.success && userManager.userInfo) {
                SessionManager.setUserInfo({
                    ...userManager.userInfo,
                    avatar: avatarImage
                });
            }

            const fetchInfo = await apiServices.auth.updateUserInfo(username, birthDate, emailValue, gender, company);
            if (fetchInfo.success) {
                SessionManager.setUserInfo({
                    ...userManager.userInfo as UserInfoModel,
                    ctv_name: username,
                    ctv_DOB: birthDate,
                    ctv_email: emailValue,
                    email: emailValue,
                    ctv_gender: gender,
                    ctv_company: company
                });
            }
            Navigator.goBack();
            ToastUtils.showSuccessToast(Languages.editProFile.saveInfo);
        }
    }, [apiServices.auth, apiServices.imageServices, birthDate, company, emailValue, gender, imageAvatar, onValidation, userManager.userInfo, username]);

    const openLibrary = useCallback(() => {
        popupUploadImageRef.current?.show();
    }, []);

    const onImageSelected = useCallback((data: any) => {
        setImageAvatar(data?.images[0]?.path);
    }, []);

    const onConfirmValue = useCallback((date: string) => {
        const newDate = DateUtils.convertBirthdayDate(date);
        setBirthDate(newDate || '');
    }, []);

    const renderPicker = useCallback((_ref: any, _value: string, _placeHolder: string, _label: string, _data?: ItemPickerProps[] | any, _disable?: boolean) => {
        const onPressItem = (_valuePress: ItemPickerProps) => {
            switch (_placeHolder) {
                case Languages.profileAuth.gender:
                    setGender(_valuePress?.value || '');
                    break;
                default:
                    break;
            }
        };
        return (
            <PickerBottomBase ref={_ref} data={_data} placeholder={_placeHolder} disable={_disable} label={_label} value={_value}
                wrapErrText={styles.wrapErrPickerText} btnContainer={styles.btnPickerContainer} styleText={styles.valuePickerStyle}
                onPressItem={onPressItem} hasDash 
            />
        );
    }, []);

    return (
        <BackgroundTienNgay>
            <View style={styles.container}>
                <HeaderBar title={`${Languages.editProFile.title}`} isLowerCase />
                <HideKeyboard>
                    <ScrollViewWithKeyboard>
                        <View style={styles.image}>
                            <Touchable radius={100} onPress={openLibrary}>
                                <MyImageView style={styles.imageAvatar} imageUrl={imageAvatar || userInfo?.avatar} />
                            </Touchable>
                        </View>
                        <View style={styles.horizontalBarContainer}>
                            <Text style={styles.horizontalBarTextStyle}>{Languages.editProFile.customerInfo}</Text>
                            <View style={styles.horizontalBarStyle} />
                        </View>
                        <View style={styles.group}>
                            {(userInfo?.account_type === TYPE_TYPE_ACCOUNT.GROUP && userInfo.form === TYPE_FORM_ACCOUNT.GROUP) && renderInput(Languages.profileAuth.company, Languages.editProFile.placeCompany, userInfo?.ctv_company, userCompanyRef, onChangeInput, 30, false, 'DEFAULT', false, TypeCapitalized.WORDS)}
                            {renderInput(Languages.profileAuth.username, Languages.editProFile.placename, userInfo?.ctv_name, userNameRef, onChangeInput, 30, false, 'DEFAULT', SessionManager.userInfo?.status_verified === STATE_AUTH_ACC.VERIFIED, TypeCapitalized.WORDS)}
                            <MyDatePicker ref={birthDateRef} title={Languages.profileAuth.birthDate} maximumDate={new Date()} date={new Date()}
                                onConfirmDatePicker={onConfirmValue}
                                dateString={DateUtils.convertReverseYear(userInfo?.ctv_DOB)} rightIcon={<IcCalendar />}
                                disabled={SessionManager.userInfo?.status_verified === STATE_AUTH_ACC.VERIFIED}
                            />

                            {renderInput(Languages.profileAuth.email, Languages.profileAuth.email, userInfo?.email, emailRef, onChangeInput, 50, false, 'EMAIL', false)}
                            {renderPicker(genderRef, Utils.convertGender(gender), Languages.profileAuth.gender, Languages.profileAuth.gender, GenderArray, SessionManager.userInfo?.status_verified === STATE_AUTH_ACC.VERIFIED)}
                        </View>
                        <View style={styles.button}>
                            <Button radius={25} label={Languages.button.btnEditProfile} onPress={onPressEdit} buttonStyle={BUTTON_STYLES.GREEN} isLowerCase />
                        </View>
                    </ScrollViewWithKeyboard>
                </HideKeyboard>
                <PopupUploadImage ref={popupUploadImageRef} onImageSelected={onImageSelected} maxSelect={1} />
                {isLoading && <MyLoading isOverview />}
            </View>
        </BackgroundTienNgay>
    );
});

export default EditProfile;

const AVATAR_SIZE = 120;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    image: {
        paddingVertical: 24,
        alignItems: 'center'
    },
    imageAvatar: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_SIZE / 2,
        borderColor: COLORS.GREEN_2,
        borderWidth: 2
    },
    group: {
        padding: 16
    },
    groupInput: {
        marginBottom: 20
    },
    title: {
        ...Styles.typography.medium,
        marginBottom: 5,
        marginLeft: 16
    },
    content: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        marginLeft: 10
    },
    button: {
        paddingHorizontal: 16,
        paddingBottom: PADDING_BOTTOM + 10
    },
    input: {
        borderColor: COLORS.GRAY_2,
        height: Configs.FontSize.size45,
        fontSize: Configs.FontSize.size14,
        borderRadius: 50
    },
    btnPickerContainer: {
        justifyContent: 'space-between',
        marginBottom: 12
    },
    valuePickerStyle: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_7
    },
    wrapErrPickerText: {
        paddingHorizontal: 10
    },
    containerInput: {
        marginBottom: 12
    },
    horizontalBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        alignItems: 'center'
    },
    horizontalBarTextStyle: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_7
    },
    horizontalBarStyle: {
        borderTopWidth: 1,
        borderTopColor: COLORS.GRAY_15,
        flex: 1,
        marginLeft: 12
    },
    inputContainer: {
        height: Configs.FontSize.size45,
        borderRadius: 50
    }
});

