import './revenues.component.css';
import template = require( './revenues.component.html' );
import { RevenuesController } from './revenues.component.controller';

// tslint:disable-next-line
export const RevenuesComponent = () => {
    return {
        template: template,
        controller: RevenuesController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};
