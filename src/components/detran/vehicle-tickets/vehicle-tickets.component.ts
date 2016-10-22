import './vehicle-tickets.component.css';
import template = require('./vehicle-tickets.component.html');
import { VehicleTicketsController } from './vehicle-tickets.component.controller';

const directive = () => {
    return {
        template: template,
        controller: VehicleTicketsController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;
