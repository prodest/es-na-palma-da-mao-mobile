import './expenses-by-area.component.css';
import template = require( './expenses-by-area.component.html' );
import { ExpensesByAreaController } from './expenses-by-area.component.controller';

const directive = () => {
    return {
        template: template,
        controller: ExpensesByAreaController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;