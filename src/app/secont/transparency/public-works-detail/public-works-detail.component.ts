import './public-works-detail.component.scss';
import template = require( './public-works-detail.component.html' );
import { PublicWorksDetailController } from './public-works-detail.component.controller';

// tslint:disable-next-line
export const PublicWorksDetailComponent = () => {
    return {
        template: template,
        controller: PublicWorksDetailController,
        restrict: 'E',
        controllerAs: 'vm',
        replace: true,
        bindToController: true
    };
};