
import { BaseService } from './base-service';
import { API_CONFIG, BASE_URL_CUSTOMER } from './constants';

export class CommonServices extends BaseService {
    getNews = async () => this.api(BASE_URL_CUSTOMER, true).post(API_CONFIG.GET_NEWS, {});

    getInsurances = async () => this.api(BASE_URL_CUSTOMER, true).post(API_CONFIG.GET_INSURANCES, {});

    getBanners = async () => this.api(BASE_URL_CUSTOMER, true).post(API_CONFIG.GET_BANNERS, {});


    getAppInReview = async () => this.api().get(API_CONFIG.CHECK_APP_REVIEW);

    getCityList = async () => this.api().post(API_CONFIG.GET_CITY_LIST);

    getDistrictList = async (hk_province: string) => this.api().post(API_CONFIG.GET_DISTRICT_LIST, this.buildFormData({
        hk_province
    }));

    getWardList = async (hk_ward: string) => this.api().post(API_CONFIG.GET_WARD_LIST, this.buildFormData({
        hk_ward
    }));

    getBankList = async () => this.api().get(API_CONFIG.GET_BANK_LIST);

    getListBankUser = async () => this.api().get(API_CONFIG.LIST_BANK_USER);

}

