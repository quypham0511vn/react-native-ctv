export type MyImageViewProps = {
    imageUrl?: string;
    style?: any;
    resizeMode?: any;
    underlayColor?: string;
    onLoadFailed?: () => void;
    onClickImage?: (item: string) => void;
}
