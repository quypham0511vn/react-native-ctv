import { Id } from './id';

export interface LoginWithThirdPartyModel {
  id: string;
  message: string;
  status: number;
  token_app: string;
}
export interface ActiveAccountSocialModel {
  created_at: number;
  created_by: string;
  id_google: string;
  phone_number: string;
  status: string;
  timeExpried_active: number;
  token_active: number;
  token_app: string;
  type: string;
  type_login: string;
  _id: Id;
}
