import './budgets.component.scss';
import template = require( './budgets.component.html' );
import { BudgetsController } from './budgets.component.controller';

// tslint:disable-next-line
export const BudgetsComponent = () => {
    return {
        template: template,
        controller: BudgetsController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};
