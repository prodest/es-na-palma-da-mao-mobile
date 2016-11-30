import './no-access.component.scss';
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

