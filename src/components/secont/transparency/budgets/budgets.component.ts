import './budgets.component.css';
import template = require( './budgets.component.html' );
import { BudgetsController } from './budgets.component.controller';

const directive = () => {
    return {
        template: template,
        controller: BudgetsController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;