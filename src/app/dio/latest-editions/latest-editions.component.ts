import './latest-editions.component.scss';
import template = require('./latest-editions.component.html');
import { LatestEditionsController } from './latest-editions.component.controller';

// tslint:disable-next-line
export const LatestEditionsComponent = () => {
    return {
        template: template,
        controller: LatestEditionsController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};