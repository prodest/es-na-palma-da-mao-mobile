import './geolocation.component.scss';
import template = require( './geolocation.component.html' );
import { GeolocationController } from './geolocation.component.controller';

// tslint:disable
export const GeolocationComponent: ng.IComponentOptions = {
    template: template,
    transclude: true,
    controller: GeolocationController,
    controllerAs: 'vm',
    bindings: {
        onLocationChanged: '&',
        refreshLocation: '<'
    }
};
