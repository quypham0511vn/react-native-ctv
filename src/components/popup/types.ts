export type PopupProps = {
    onClose?: () => any;
    onConfirm?: () => any;
    onBackdropPress?: () => any;
    content?: string;
    btnText?: string;
    hasBtnAgree?: boolean;
    hasBtnClose?: boolean;
    uri?: string;
};

export type PopupActions = {
    show: (content?: string) => any;
    hide?: (content?: string) => any;
    setContent?: (message: string) => void;
    setErrorMsg?: (msg?: string) => void;
};


