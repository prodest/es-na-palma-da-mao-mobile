/* tslint:disable */

declare var sinon: Sinon.SinonStatic;
declare var angular: angular.IAngularStatic;


declare module 'rxjs/Observable' {
    export interface Observable<T> { subscribe: Function; }
}
declare module 'rxjs/Rx' {
    export interface Observable<T> { }
}

declare module '*.html' {
    const content: string;
    export = content;
}

declare module '*.json' {
    const content: any;
    export = content;
}

declare module '*.png' {
    const content: any;
    export = content;
}

declare module '*.jpg' {
    const content: any;
    export = content;
}

declare module '*.gif' {
    const content: any;
    export = content;
}


declare module 'ionic-calendar' {
    const content: string;
    export = content;
}
