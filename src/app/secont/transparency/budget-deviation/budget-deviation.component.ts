import './budget-deviation.component.scss';
import template = require( './budget-deviation.component.html' );
import { BudgetDeviationController } from './budget-deviation.component.controller';

// tslint:disable-next-line
export const BudgetDeviationComponent = () => {
    return {
        template: template,
        controller: BudgetDeviationController,
        restrict: 'E',
        controllerAs: 'vm',
        replace: true,
        bindToController: true
    };
};
