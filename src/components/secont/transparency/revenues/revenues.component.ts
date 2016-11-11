import './revenues.component.css';
import template = require( './revenues.component.html' );
import { RevenuesController } from './revenues.component.controller';

const directive = () => {
    return {
        template: template,
        controller: RevenuesController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;