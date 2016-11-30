import './about.component.scss';
import template = require('./about.component.html');
import { AboutController } from './about.component.controller';

// tslint:disable-next-line
export const AboutComponent = () => {
    return {
        template: template,
        controller: AboutController,
        restrict: 'E',
        controllerAs: 'vm',
        replace: true,
        bindToController: true
    };
};