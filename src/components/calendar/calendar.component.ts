import './calendar.component.css';
import template = require('./calendar.component.html');
import { CalendarController } from './calendar.component.controller';

const directive = () => {
    return {
        template: template,
        controller: CalendarController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;





