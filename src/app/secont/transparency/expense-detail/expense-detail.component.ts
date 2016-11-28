import './expense-detail.component.css';
import template = require( './expense-detail.component.html' );
import { ExpenseDetailController } from './expense-detail.component.controller';

// tslint:disable-next-line
export const ExpenseDetailComponent = () => {
    return {
        template: template,
        controller: ExpenseDetailController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};
