import './expense-detail.component.css';
import template = require( './expense-detail.component.html' );
import { ExpenseDetailController } from './expense-detail.component.controller';

const directive = () => {
    return {
        template: template,
        controller: ExpenseDetailController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;