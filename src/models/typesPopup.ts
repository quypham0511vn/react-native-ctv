export type PopupActionTypes = {
  show: (content?: string) => any;
  hide: (content?: string) => any;
  setContent?: (message: string) => void;
  setErrorMsg?: (msg?: string) => void;
};
export type PopupPropsTypes = {
  onClose?: () => any;
  onConfirm?: () => any;
  onBackdropPress?: () => any;
  title?: string;
  content?: string;
  btnText?: string;
};
