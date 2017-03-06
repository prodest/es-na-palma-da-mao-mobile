import './bus-stops.component.scss';
import template = require( './bus-stops.component.html' );
import { BusStopsController } from './bus-stops.component.controller';

// tslint:disable-next-line
export const BusStopsComponent = () => {
    return {
        template: template,
        controller: BusStopsController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};