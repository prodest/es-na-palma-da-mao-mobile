import './vehicle-tickets.component.css';
import template = require('./vehicle-tickets.component.html');
import { VehicleTicketsController } from './vehicle-tickets.component.controller';

// tslint:disable-next-line
export const VehicleTicketsComponent = () => {
    return {
        template: template,
        controller: VehicleTicketsController,
        restrict: 'E',
        controllerAs: 'vm',
        replace: true,
        bindToController: true
    };
};

