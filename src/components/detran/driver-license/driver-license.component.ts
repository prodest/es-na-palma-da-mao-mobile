import './driver-license.component.css';
import template = require('./driver-license.component.html');
import { DriverLicenseController } from './driver-license.component.controller';

const directive = () => {
    return {
        template: template,
        controller: DriverLicenseController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;
