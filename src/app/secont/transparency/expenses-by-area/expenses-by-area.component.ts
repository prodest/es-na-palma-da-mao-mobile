import './expenses-by-area.component.scss';
import template = require( './expenses-by-area.component.html' );
import { ExpensesByAreaController } from './expenses-by-area.component.controller';

// tslint:disable-next-line
export const ExpensesByAreaComponent = () => {
    return {
        template: template,
        controller: ExpensesByAreaController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};
