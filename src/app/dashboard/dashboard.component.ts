import './dashboard.component.scss';
import template = require('./dashboard.component.html');
import { DashBoardController } from './dashboard.component.controller';

// tslint:disable-next-line
export const DashBoardComponent = () => {
    return {
        template: template,
        controller: DashBoardController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

