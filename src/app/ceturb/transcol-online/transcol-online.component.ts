import './transcol-online.component.scss';
import template = require( './transcol-online.component.html' );
import { TranscolOnlineController } from './transcol-online.component.controller';

// tslint:disable-next-line
export const TranscolOnlineComponent = () => {
    return {
        template: template,
        controller: TranscolOnlineController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};