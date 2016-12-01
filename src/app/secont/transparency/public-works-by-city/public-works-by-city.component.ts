import './public-works-by-city.component.scss';
import template = require( './public-works-by-city.component.html' );
import { PublicWorksByCityController } from './public-works-by-city.component.controller';

// tslint:disable-next-line
export const PublicWorksByCityComponent = () => {
    return {
        template: template,
        controller: PublicWorksByCityController,
        restrict: 'E',
        controllerAs: 'vm',
        replace: true,
        bindToController: true
    };
};