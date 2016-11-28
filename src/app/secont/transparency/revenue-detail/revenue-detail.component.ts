import './revenue-detail.component.css';
import template = require( './revenue-detail.component.html' );
import { RevenueDetailController } from './revenue-detail.component.controller';

// tslint:disable-next-line
export const RevenueDetailComponent = () => {
    return {
        template: template,
        controller: RevenueDetailController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};
