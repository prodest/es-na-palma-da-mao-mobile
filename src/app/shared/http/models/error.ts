export interface Error {

    /**
     * O erro de aplicação
     * 
     * @type {string}
     * @memberOf Error
     */
    error: string;

    /**
     * Uma mensagem de erro amigáve para o usuário
     * 
     * @type {string}
     * @memberOf Error
     */
    message?: string;
    handled: boolean;
    guid: string;
    status: number;
    isTimeout: boolean;
}