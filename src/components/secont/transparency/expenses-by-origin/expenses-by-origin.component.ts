import './expenses-by-origin.component.css';
import template = require( './expenses-by-origin.component.html' );
import { ExpensesByOriginController } from './expenses-by-origin.component.controller';

const directive = () => {
    return {
        template: template,
        controller: ExpensesByOriginController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;