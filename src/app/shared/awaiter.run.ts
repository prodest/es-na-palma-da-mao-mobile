/* tslint:disable: no-invalid-this no-unused-expression */

import { ITimeoutService } from 'angular';

declare var __awaiter: Function;

/**
 * Refs: 
 * - http://stackoverflow.com/questions/35629246/typescript-async-await-and-angular-q-service
 * - https://github.com/llRandom/ts-awaiter/blob/master/wwwroot/ts/awaiter.ts
 * 
 * @param {ITimeoutService} $timeout
 */
function awaiterRun( $timeout: ITimeoutService ) {

    const oldAwaiter = __awaiter;

    /**
     * 
     * 
     * @param {Function} func
     * @returns
     */
    function wrap( func: Function ) {
        return function () {
            func.apply( this, arguments );
            $timeout(() => { }); // run angular digest
        };
    }


    ( window as any ).__awaiter = ( thisArg: any, aarguments: any, P: Function, generator: any ) => {
        P = function ( executor: Function ) {
            return new Promise<any>(( resolve, reject ) => {
                resolve = wrap( resolve );
                reject = wrap( reject );
                executor( resolve, reject );
            });
        };
        return oldAwaiter( thisArg, aarguments, P, generator );
    };
}
awaiterRun.$inject = [ '$timeout' ];

export default awaiterRun;
