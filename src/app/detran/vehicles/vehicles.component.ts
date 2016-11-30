import './vehicles.component.scss';
import template = require('./vehicles.component.html');
import { VehiclesController } from './vehicles.component.controller';

// tslint:disable-next-line
export const VehiclesComponent = () => {
    return {
        template: template,
        controller: VehiclesController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};
