
/**
 * Informações de identity do usuário comums a todos os providers de autenticação
 * 
 * @export
 * @interface Identity
 */
export interface Identity {
    client_id: string;
    client_secret: string;
    grant_type: string;
    scope: string;
    refresh_token?: string;
}

