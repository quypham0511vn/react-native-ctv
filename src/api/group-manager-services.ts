import { BaseService } from './base-service';
import { API_CONFIG } from './constants';

export class GroupManagerServices extends BaseService {
    getListStaff = async (limit: Number, offset: Number) => this.api().get(API_CONFIG.LIST_STAFF, ({ limit, offset }));

    getReportGroup = async () => this.api().get(API_CONFIG.REPORT_GROUP, this.buildFormData({}));

    getTotalMember = async () => this.api().get(API_CONFIG.TOTAL_MEMBER, this.buildFormData({}));

    getListBonus = async () => this.api().post(API_CONFIG.LIST_BONUS, this.buildFormData({}));

    getReportGroupYear = async () => this.api().get(API_CONFIG.REPORT_GROUP_BY_YEAR, this.buildFormData({}));

    getReportGroupMonth = async (month: Number) => this.api().get(API_CONFIG.REPORT_GROUP_BY_MONTH, ({ month }));

    getReportRateMember = async (month: Number, limit: Number, offset: Number) => this.api().get(API_CONFIG.REPORT_RATE_MEMBER, ({ month, limit, offset }));

    updateStatus = async (id: string) => this.api().post(API_CONFIG.UPDATE_STATUS, this.buildFormData({ id }));

    createStaff = async (name: string, phone: string) => this.api().post(API_CONFIG.CREATE_STAFF, this.buildFormData({ collaborator_member_name: name, collaborator_member_phone: phone }));
}
