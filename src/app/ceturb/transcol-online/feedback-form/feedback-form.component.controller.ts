
export class FeedbackFormController {

    public showLine: boolean;
    public showStop: boolean;
    public showTime: boolean;
    public showText: boolean;

    public line: number;
    public stop: number;
    public time: Date;
    public text: string;

    public static $inject: string[] = [];

    constructor() {
    }

    public send() {
    }

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
