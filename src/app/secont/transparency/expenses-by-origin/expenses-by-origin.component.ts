import './expenses-by-origin.component.scss';
import template = require( './expenses-by-origin.component.html' );
import { ExpensesByOriginController } from './expenses-by-origin.component.controller';

// tslint:disable-next-line
export const ExpensesByOriginComponent = () => {
    return {
        template: template,
        controller: ExpensesByOriginController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};
