import './dashboard.component.css';
import template = require('./dashboard.component.html');
import { DashBoardController } from './dashboard.component.controller';

const directive = () => {
    return {
        template: template,
        controller: DashBoardController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;
