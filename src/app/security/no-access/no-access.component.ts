import './no-access.component.css';
import template = require('./no-access.component.html');
import { NoAccessController } from './no-access.component.controller';

// tslint:disable-next-line
export const NoAccessComponent = () => {
    return {
        template: template,
        controller: NoAccessController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

