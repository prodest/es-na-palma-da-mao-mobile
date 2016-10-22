import './vehicles.component.css';
import template = require('./vehicles.component.html');
import { VehiclesController } from './vehicles.component.controller';

const directive = () => {
    return {
        template: template,
        controller: VehiclesController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;
