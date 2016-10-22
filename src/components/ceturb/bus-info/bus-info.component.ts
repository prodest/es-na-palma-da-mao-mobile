import './bus-info.component.css';
import template = require('./bus-info.component.html');
import { BusInfoController } from './bus-info.component.controller';

const directive = () => {
    return {
        template: template,
        controller: BusInfoController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;
