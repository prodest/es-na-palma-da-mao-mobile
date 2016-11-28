import './calendar.component.css';
import template = require('./calendar.component.html');
import { CalendarController } from './calendar.component.controller';

// tslint:disable-next-line
export const CalendarComponent = () => {
    return {
        template: template,
        controller: CalendarController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};





