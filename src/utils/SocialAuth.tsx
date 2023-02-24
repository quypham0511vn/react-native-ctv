/* eslint-disable consistent-return */
import appleAuth from '@invertase/react-native-apple-authentication';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';
import {
    AccessToken, GraphRequest, GraphRequestManager, LoginManager,
    Profile
} from 'react-native-fbsdk-next';

import { configGoogleSignIn } from '@/commons/constants';
import ToastUtils from './ToastUtils';
import Languages from '@/commons/Languages';




export const loginWithApple = async () => {
    try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
        });

        console.log('appleAuthRequestResponse', appleAuthRequestResponse);

        const data = appleAuthRequestResponse;
        if (data?.identityToken) {
            return data;
        }
        return null;
    } catch (error: any) {
        if (error?.code === appleAuth.Error.CANCELED) {
            console.warn('User canceled Apple Sign in.');
        } else {
            console.error(error);
        }
        return null;
    }
};
export const loginWithGoogle = async () => {
    try {
        GoogleSignin.configure(configGoogleSignIn);

        if (Platform.OS === 'android') {
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        }
        const { idToken } = await GoogleSignin.signIn();
        if (idToken) {
            const userInfo = await GoogleSignin.signInSilently();
            if (userInfo) GoogleSignin.signOut();
            return userInfo;
        }
        ToastUtils.showErrorToast(Languages.errorMsg.errLoginSocial);
        return null;
    } catch (err) {
        console.log('getAccessTokenGoogle error', err);
        return null;
    }
};

const customFacebookLogoutAndroid = () => {
    let current_access_token = '';
    AccessToken.getCurrentAccessToken().then((_data) => {
        current_access_token = _data?.accessToken.toString() || '';
    }).then(() => {
        const logout = new GraphRequest(
            'me/permissions/',
            {
                accessToken: current_access_token,
                httpMethod: 'DELETE'
            },
            (error, result) => {
                if (error) {
                    console.log(`Error fetching data: ${JSON.stringify(error)}`);
                } else { LoginManager.logOut(); }
            });
        new GraphRequestManager().addRequest(logout).start();
    }).catch(error => {
        console.log(error);
    });
};

export const loginWithFacebook = async () => {
    try {
        if (Platform.OS === 'android') {
            LoginManager.setLoginBehavior('web_only');
        }
        const result = await LoginManager.logInWithPermissions(
            ['public_profile', 'email'],
            'limited',
            'my_nonce'
        );
        console.log('err Facebook=', result);
        if (!result.isCancelled) {
            let data;
            if (Platform.OS === 'android') {
                data = await AccessToken.getCurrentAccessToken();
                console.log(data);
            } else { data = await Profile.getCurrentProfile(); }
            console.log('data FB_Apple=', data);
            if (data) {
                if (Platform.OS === 'android') {
                    customFacebookLogoutAndroid();
                }
                else LoginManager.logOut();
            }
            return data;
        }
    } catch (error) {
        console.log('err Facebook=', error);
        return null;
    }
};
