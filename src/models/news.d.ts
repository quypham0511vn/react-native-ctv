import { BaseModel } from './base-model';

export interface NewsModel extends BaseModel {
    image: string;
    title_vi: string;
    link: string;
    benefit_vi: string;
    fee_insurance_vi: string;
    type_finance_vi: string;
    summary_vi: string;
    content_vi: string;
    title_en: string;
    benefit_en: string;
    fee_insurance_en: string;
    type_finance_en: string;
    summary_en: string;
    content_en: string;
    level: string;
    status: string;
    period: number;
    province: string;
    province_text: string;
    page_title_seo: string;
    description_tag_seo: string;
    keyword_tag_seo: string;
    url_seo: string;
    image_mobile: string;
    sub_link: string;
    limit: string;
    type_new: string;
    created_at: number;
    updated_at: number;
    created_by: number;
    updated_by: string;
    type: string;
}
