import './driver-license-status.component.css';
import template = require('./driver-license-status.component.html');
import { DriverLicenseStatusController } from './driver-license-status.component.controller';

const directive = () => {
    return {
        template: template,
        controller: DriverLicenseStatusController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;
