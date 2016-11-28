import { Error } from '../../../shared/http/index';

export class ErrorMessageController {
    public error: Error;
    public unhandledErrorMessage: string;

    /**
     * Creates an instance of ErrorMessageController.
     * 
     */
    constructor() {
         this.unhandledErrorMessage = this.unhandledErrorMessage || 'Erro inesperado';
    }


    /**
     * Indica se é um server error (500-599)
     * 
     * @readonly
     * @type {boolean}
     */
    public get isServerError(): boolean {
        return /5\d{2}/.test( this.error.status.toString() );
    }
}