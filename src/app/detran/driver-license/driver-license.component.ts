import './driver-license.component.scss';
import template = require('./driver-license.component.html');
import { DriverLicenseController } from './driver-license.component.controller';

// tslint:disable-next-line
export const DriverLicenseComponent = () => {
    return {
        template: template,
        controller: DriverLicenseController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};
