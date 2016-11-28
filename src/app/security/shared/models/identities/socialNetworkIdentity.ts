import {Identity} from './identity';

/**
 * Identity de usuário para autenticação usando redes sociais
 * 
 * @export
 * @interface SocialNetworkIdentity
 * @extends {Identity}
 */
export interface SocialNetworkIdentity extends Identity {
    accesstoken?: string;
    provider?: string;
}