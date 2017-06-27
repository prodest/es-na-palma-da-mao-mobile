import { User } from '../../../../security/shared/index';

export type FeedBack = {
    line?: number,
    stop?: number,
    time?: Date,
    text?: string,
    type?: FeedBackType,
    user?: User
};

export enum FeedBackType {
    LinhaNaoAparece = 0,
    LocalizacaoErrada = 1,
    ErroNoHorario = 2,
    ErroNaPrevisao = 3,
    OutroProblema = 4
}

export class FeedbackFormController {

    public showLine: boolean;
    public showStop: boolean;
    public showTime: boolean;
    public showText: boolean;

    public form: FeedBack;

    // public static $inject: string[] = [];

    // tslint:disable-next-line:variable-name
    public onSendFeedback: ( { form: FeedBack }) => void;

    /**
     * Creates an instance of FeedbackFormController.
     * @memberof FeedbackFormController
     */
    constructor() { }

    /**
     * 
     * 
     * @param {*} form 
     * @memberof FeedbackFormController
     */
    public send( form: FeedBack ) {
        if ( form ) {
            this.onSendFeedback( { form });
        }
    }

    /**
     * 
     * 
     * @readonly
     * @memberof FeedbackFormController
     */
    public get description() {
        let desc = 'Favor informar ';
        if ( this.showText ) {
            desc += 'uma descrição';
        } else {
            if ( this.showLine ) {
                desc += 'a linha';
                if ( this.showStop ) {
                    desc += ', o ponto';
                    if ( this.showTime ) {
                        desc += ' e o horário';
                    }
                } else {
                    if ( this.showTime ) {
                        desc += ' e o horário';
                    }
                }
            } else {
                if ( this.showStop ) {
                    desc += 'o ponto';
                    if ( this.showTime ) {
                        desc += ' e o horário';
                    }
                } else {
                    if ( this.showTime ) {
                        desc += 'o horário';
                    }
                }
            }
        }
        desc += ' do ocorrido abaixo:';
        return desc;
    }
}
