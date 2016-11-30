import './home.component.scss';
import template = require('./home.component.html');
import { HomeController } from './home.component.controller';

// tslint:disable-next-line
export const HomeComponent = () => {
    return {
        template: template,
        controller: HomeController,
        restrict: 'E',
        controllerAs: 'vm', // scope: {},
        replace: true,
        bindToController: true
    };
};

