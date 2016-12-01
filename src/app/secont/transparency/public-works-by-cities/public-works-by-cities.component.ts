import './public-works-by-cities.component.scss';
import template = require( './public-works-by-cities.component.html' );
import { PublicWorksByCitiesController } from './public-works-by-cities.component.controller';

// tslint:disable-next-line
export const PublicWorksByCitiesComponent = () => {
    return {
        template: template,
        controller: PublicWorksByCitiesController,
        restrict: 'E',
        controllerAs: 'vm',
        replace: true,
        bindToController: true
    };
};