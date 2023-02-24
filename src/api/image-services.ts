import Languages from '@/commons/Languages';
import ToastUtils from '@/utils/ToastUtils';
import Utils from '@/utils/Utils';
import { BaseService } from './base-service';
import { API_CONFIG } from './constants';

export class ImageServices extends BaseService {
    
    uploadImage = async (file: any) => {

        const form = new FormData();
        form.append('file', {
            uri: file || '',
            name: Utils.getFileNameByPath(file),
            type: 'image/jpeg'
        } as any);

        const config = {
            headers: {
                'Accept': 'multipart/form-data',
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (value: any) => {
                const percent: string = `${(value.loaded / value.total) * 100}`;
                ToastUtils.showMsgToast(`${Languages.errorMsg.uploading}... ${parseInt(percent, 10)}%`);
            }
        };
        const resUpload: any = await this.api().post(API_CONFIG.UPLOAD_HTTP_IMAGE, form, config);
        console.log('resUpload', JSON.stringify(resUpload));
        
        if(resUpload?.success)
        {
            if (resUpload?.data) {
                return { success: true, data: resUpload.data };
            } 
          
            ToastUtils.showErrorToast(Languages.image.uploadFailed);
            return { success: false, data: null };
        }
        ToastUtils.showErrorToast(Languages.image.uploadFailed);
        return { success: false, data: null };
    };
}

