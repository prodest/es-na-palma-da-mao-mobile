
import { AcessoCidadaoClaims } from './claims/acessoCidadaoClaims';
import defaultAvatarSrc = require( '../img/user.png' );

export class User implements AcessoCidadaoClaims {

    /**
     * Creates an instance of User.
     * 
     * 
     * @memberOf User
     */
    private constructor() { }

    /**
     * 
     * 
     * @static
     * @returns
     * 
     * @memberOf User
     */
    public static createNullUser() {
        const user = new User();

        user.nome = 'Usuário visitante';
        user.anonymous = false;
        user.isAuthenticated = false;
        user.avatarUrl = defaultAvatarSrc;

        return user;
    }

    /**
     * 
     * 
     * @static
     * @param {AcessoCidadaoClaims} claims
     * @returns {User}
     * 
     * @memberOf User
     */
    public static createFrom( claims: AcessoCidadaoClaims ): User {
        return Object.assign( new User(), claims, {
            anonymous: false,
            isAuthenticated: true,
            avatarUrl: defaultAvatarSrc
        });
    }

    public celularValidado: boolean;
    public cpf: string;
    public dateofbirth: string;
    public emailaddress: string;
    public homephone: string;
    public mobilephone: string;
    public nome: string;
    public nomemae: string;
    public nomepai: string;
    public sid: string;
    public sub: number;
    public cnhNumero: string;
    public cnhCedula: string;

    // extra properties

    public anonymous: boolean;
    public avatarUrl: string;
    public isAuthenticated: boolean;
}