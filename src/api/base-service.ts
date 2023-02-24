import apiSauce from 'apisauce';

import StorageUtils from '../utils/StorageUtils';
import Validate from '../utils/Validate';
import { Events } from '../commons/constants';
import { TIMEOUT_API } from '../commons/Configs';
import Languages from '../commons/Languages';
import { EventEmitter } from '../utils/EventEmitter';
import ToastUtils from '../utils/ToastUtils';
import { API_CONFIG } from './constants';
import { HeaderType } from './types';
import SessionManager, { DeviceInfos } from '@/managers/SessionManager';

export const ResponseCodes = {
    Success: 200,

    BadRequest: 400,
    NotFound: 404,
    ServerError: 500,
    TokenInvalid: 401,
    Timeout: 408,
    Permission: 403,
    InvalidUser: 102,
    UserLocked: 101,
    UserNotActive: 999,
    UserExits: 402,
    DeviceExits: 405,
    Expires: 406,
    Used: 407,
    UserProfileExits: 409,
    EmailNotNull: 410,
    DecryptFail: 411
};

const HEADER = {
    Accept: 'application/json'
};

const getHeader = (tokenNotRequired?: boolean) => {
    const myHeader: HeaderType = {
        ...HEADER,
        DeviceId: DeviceInfos.DeviceId,
        DeviceName: DeviceInfos.DeviceName
    };
    if (!tokenNotRequired && SessionManager.accessToken) {
        myHeader.Authorization = SessionManager.accessToken;
    }
    return myHeader;
};
export class BaseService {
    latestParamBeforeEncrypted = null; // use for case resume current request

    api = (baseURL?: string, tokenNotRequired?: boolean, isDoNotShowToast?: boolean) => {
        const defHeader = getHeader(tokenNotRequired);
        const _api = apiSauce.create({
            baseURL: baseURL || API_CONFIG.BASE_URL,
            headers: defHeader,
            timeout: TIMEOUT_API
        });

        _api.addAsyncResponseTransform(async (response: any) => {
            let isShowToast = false;
            if (isDoNotShowToast) {
                isShowToast = isDoNotShowToast;
            }
            const { data, message, code, success, transactionId } =
                await this.checkResponseAPI(response, isShowToast);

            if (data?.token_app) {
                await SessionManager.setAccessToken(data.token_app, data?._id?.$oid);
            }

            if (typeof data !== 'undefined') {
                try {
                    response.data = JSON.parse(data);
                } catch (e) {
                    // return non-json Data
                    response.data = data;
                }
            }

            response.success = success;
            response.message = message;
            response.code = code;
            response.transactionId = transactionId;
        });

        return _api;
    };

    onLogout = (msg?: string) => {
        if (SessionManager.accessToken) {
            EventEmitter.emit(Events.LOGOUT);
            ToastUtils.showErrorToast(msg || Languages.errorMsg.sessionExpired);
        }
    };

    checkResponseAPI(response: any, isDoNotShowToast: boolean) {
        console.log('API: ', response);
        if (
            response.problem === 'NETWORK_ERROR' ||
            response.problem === 'TIMEOUT_ERROR'
        ) {
            ToastUtils.showErrorToast(Languages.errorMsg.noInternet);
            return { success: false, data: null };
        }
        if (!response.config) {
            return { success: false, data: null };
        }

        const endPoint = response.config.url;
        switch (response.status) {
            case ResponseCodes.TokenInvalid:
            case ResponseCodes.BadRequest: {
                let message = '';
                if (
                    response.data &&
                    response.data.error_description &&
                    response.data.error
                ) {
                    if (endPoint === API_CONFIG.TOKEN) {
                        // join error message & code for display in login form
                        message = `${response.data.error}-${response.data.error_description}`;
                    } else if (!isDoNotShowToast) {
                        ToastUtils.showErrorToast(response.data.error_description);
                    }
                } else {
                    ToastUtils.showErrorToast(Languages.errorMsg.sessionExpired);
                }
                // EventEmitter.emit(Events.LOGOUT);
                return { success: false, data: null, message };
            }
            case ResponseCodes.Expires: {
                this.onLogout();
                return { success: false, data: null };
            }
            case ResponseCodes.Permission: {
                this.onLogout(Languages.errorMsg.invalidAccount);
                return { success: false, data: null };
            }
            default:
                break;
        }

        const code = Number(response.data?.status);
        let showToast = true;

        switch (code) {
            case ResponseCodes.Success:
                showToast = false;
                break;
            case ResponseCodes.DecryptFail:
                ToastUtils.showErrorToast(Languages.errorMsg.noInternet);
                return { success: false, data: null };
            case ResponseCodes.Permission:
                this.onLogout();
                return { success: false, data: null };
            default:
                if (response.data?.message && showToast && !isDoNotShowToast) {
                    ToastUtils.showErrorToast(response.data?.message);
                }
                break;
        }

        return {
            ...response.data,
            success:
                !Validate.isEmpty(response.data?.token) ||
                code === ResponseCodes.Success,
            code
        };
    }

    buildUrlEncoded = (data: any) => {
        const params = new URLSearchParams();
        Object.keys(data).map((key) => params.append(key, data[key]));
        return params;
    };

    buildFormData = (data: any) => {
        const formData = new FormData();
        const keys = Object.keys(data);
        if (keys && keys.length > 0) {
            keys.forEach((key) => {
                if (data[key] instanceof Array) {
                    if (data[key].length > 0) {
                        for (let i = 0; i < data[key].length; i++) {
                            formData.append(`${key}`, data[key][i]);
                        }
                    }
                } else if (key !== 'file') {
                    formData.append(key, data[key]);
                } else if (data[key]) {
                    formData.append(key, {
                        uri: data[key]?.path || data[key],
                        type: 'image/jpeg'
                    } as any);
                }
            });
        }

        formData.append('type', '2'); // Type of app

        console.log('formData = ', JSON.stringify(formData));
        return formData;
    };

    appendFileToFormData = (uri: string, name: string) => ({
        file: {
            name,
            uri,
            type: '*/*'
        }
    });

    insertDeviceInfo = (data: any) => {
        data.deviceId = DeviceInfos.DeviceId;
        data.deviceName = DeviceInfos.DeviceName;
        return data;
    };

    // cache data
    requestSavedData = async (endPoint: string, postParam?: any) => {
        const keySaved = endPoint;

        const savedData = await StorageUtils.getDataByKey(keySaved);
        if (savedData) {
            return { success: true, data: JSON.parse(savedData) };
        }
        let response;
        if (postParam) {
            response = await this.api().post(endPoint, postParam);
        } else {
            response = await this.api().get(endPoint);
        }

        if (response.success) {
            const resData = response.data;
            const jData = JSON.stringify(resData);
            await StorageUtils.saveDataToKey(keySaved, jData);
            return { success: true, data: resData };
        }
        return { success: false, data: null };
    };

}
