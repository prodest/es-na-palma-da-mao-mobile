// tslint:disable-next-line
/// <reference path="./module.augmentation.d.ts" /> 
/// <reference path="./module.declaration.d.ts" /> 

import './main.polyfill';
import * as tsLib from 'tslib';

// make all typescript helpers available on window object. It allows decorate helpers later. 
Object.assign( window, tsLib );

import appModule from './app/app.module';

/*
 * As we are using ES6 with Angular 1.x we can't use ng-app directive
 * to bootstrap the application as modules are loaded asynchronously.
 * Instead, we need to bootstrap the application manually
 */
angular.element( document ).ready( function () {
    angular.bootstrap( document, [ appModule ], {
        strictDi: true
    });
});
