import { Events, ToastTypes } from '../commons/constants';
import { EventEmitter } from './EventEmitter';

function showToast(msg: string, type: number) {
    if (msg) {
        const obj = {
            msg,
            type
        };
        EventEmitter.emit(Events.TOAST, obj);
    }
};

function showSuccessToast(msg: string) {
    showToast(msg, ToastTypes.SUCCESS);
};

function showErrorToast(msg: string) {
    showToast(msg, ToastTypes.ERR);
};

function showMsgToast(msg: string) {
    showToast(msg, ToastTypes.MSG);
};

export default {
    showSuccessToast,
    showErrorToast,
    showMsgToast
};
