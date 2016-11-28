import {Identity} from './identity';


/**
 * Identity de usuário para autenticação usando celular
 * 
 * @export
 * @interface PhoneIdentity
 * @extends {Identity}
 */
export interface PhoneIdentity extends Identity {
    accesstoken?: string;
    provider?: string;
    apiUrl?: string;
    authHeader?: string;
}
