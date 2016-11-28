import {Identity} from './identity';

/**
 * Identity de usuário para autenticação com login e senha
 * 
 * @export
 * @interface AcessoCidadaoIdentity
 * @extends {Identity}
 */
export interface AcessoCidadaoIdentity extends Identity {
    username?: string;
    password?: string;
}