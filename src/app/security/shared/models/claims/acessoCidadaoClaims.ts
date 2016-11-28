
/**
 * Claims do Acesso Cidadão
 * 
 * @export
 * @interface AcessoCidadaoClaims
 */
export interface AcessoCidadaoClaims {

    /**
     * Claim indicando se o celular do usuário está validado
     * 
     * @type {boolean}
     */
    celularValidado: boolean;


    /**
     * Claim com cpf do usuário
     * 
     * @type {string}
     */
    cpf: string;


    /**
     * Claim com a data de nascimento do usuário
     * 
     * @type {string}
     */
    dateofbirth: string;


    /**
     * Claim com o email do usuário
     * 
     * @type {string}
     */
    emailaddress: string;


    /**
     * Claim com o telefone residencial do usuário
     * 
     * @type {string}
     */
    homephone: string;


    /**
     * Claim com o telefone celular do usuário
     * 
     * @type {string}
     */
    mobilephone: string;

    /**
     * Claim com o nome do usuário
     * 
     * @type {string}
     */
    nome: string;


    /**
     * Claim com o nome da mãe do usuário
     * 
     * @type {string}
     */
    nomemae: string;


    /**
     * Claim com o nome do pai do usuário
     * 
     * @type {string}
     */
    nomepai: string;


    /**
     * Subject Id Claim
     * 
     * O Id do usuário
     * 
     * @type {string}
     */
    sid: string;

    /**
     * Subject Id Claim
     * 
     * O Id do usuário
     * 
     * @type {string}
     */
    sub: number;


    /**
     * Número de registro da CNH  
     * 
     * @type {string}
     */
    cnhNumero: string;

    /**
     * Cédula da CNH 
     * 
     * @type {string}
     */
    cnhCedula: string;
}