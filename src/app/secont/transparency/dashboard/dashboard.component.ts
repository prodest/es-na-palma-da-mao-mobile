import './dashboard.component.scss';
import template = require( './dashboard.component.html' );
import { DashboardController } from './dashboard.component.controller';

// tslint:disable-next-line
export const DashboardComponent = () => {
    return {
        template: template,
        controller: DashboardController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

