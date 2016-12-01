import './public-works.component.scss';
import template = require( './public-works.component.html' );
import { PublicWorksController } from './public-works.component.controller';

// tslint:disable-next-line
export const PublicWorksComponent = () => {
    return {
        template: template,
        controller: PublicWorksController,
        restrict: 'E',
        controllerAs: 'vm',
        replace: true,
        bindToController: true
    };
};