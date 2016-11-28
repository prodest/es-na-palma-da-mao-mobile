import './bus-lines.component.css';
import template = require('./bus-lines.component.html');
import { BusLinesController } from './bus-lines.component.controller';

// tslint:disable-next-line
export const BusLinesComponent = () => {
    return {
        template: template,
        controller: BusLinesController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};