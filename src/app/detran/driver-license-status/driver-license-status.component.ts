import './driver-license-status.component.css';
import template = require('./driver-license-status.component.html');
import { DriverLicenseStatusController } from './driver-license-status.component.controller';

// tslint:disable-next-line
export const DriverLicenseStatusComponent = () => {
    return {
        template: template,
        controller: DriverLicenseStatusController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

